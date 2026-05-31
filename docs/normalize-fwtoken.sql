SET XACT_ABORT ON;
GO

/*
    Normalize existing Link.FwToken values for the strict token parser.

    Valid FwToken rule after batch 5:
    - exactly 8 characters
    - lowercase hexadecimal only: 0-9 and a-f

    What this script does:
    1. Reports current token health.
    2. Trims whitespace and lowercases tokens that become valid lowercase hex.
    3. Blocks the update if normalization would create duplicates.
    4. Lists tokens that still require manual remediation.

    Review all result sets before running this against production.
*/

PRINT 'Current FwToken health summary';

SELECT
    COUNT(*) AS [TotalLinks],
    SUM(CASE WHEN [FwToken] IS NULL THEN 1 ELSE 0 END) AS [NullTokens],
    SUM(CASE WHEN [FwToken] IS NOT NULL AND [FwToken] <> LTRIM(RTRIM([FwToken])) THEN 1 ELSE 0 END) AS [WhitespaceTokens],
    SUM(CASE WHEN [FwToken] COLLATE Latin1_General_BIN2 <> LOWER([FwToken]) COLLATE Latin1_General_BIN2 THEN 1 ELSE 0 END) AS [UppercaseOrMixedCaseTokens],
    SUM(CASE WHEN [FwToken] IS NOT NULL AND LEN([FwToken]) <> 8 THEN 1 ELSE 0 END) AS [InvalidLengthTokens],
    SUM(CASE WHEN [FwToken] IS NOT NULL AND [FwToken] COLLATE Latin1_General_BIN2 LIKE '%[^0-9a-f]%' THEN 1 ELSE 0 END) AS [InvalidLowerHexTokens],
    SUM(CASE WHEN [FwToken] IS NOT NULL AND LEN([FwToken]) = 8 AND [FwToken] COLLATE Latin1_General_BIN2 NOT LIKE '%[^0-9a-f]%' THEN 1 ELSE 0 END) AS [AlreadyValidTokens]
FROM [dbo].[Link];
GO

PRINT 'Rows that need normalization or manual remediation';

WITH TokenReview AS
(
    SELECT
        [Id],
        [FwToken] AS [CurrentFwToken],
        LOWER(LTRIM(RTRIM([FwToken]))) AS [NormalizedFwToken],
        CASE
            WHEN [FwToken] IS NULL THEN 'Manual: token is NULL'
            WHEN LEN(LTRIM(RTRIM([FwToken]))) <> 8 THEN 'Manual: normalized token length is not 8'
            WHEN LOWER(LTRIM(RTRIM([FwToken]))) COLLATE Latin1_General_BIN2 LIKE '%[^0-9a-f]%' THEN 'Manual: normalized token is not lowercase hex'
            WHEN [FwToken] COLLATE Latin1_General_BIN2 <> LOWER(LTRIM(RTRIM([FwToken]))) COLLATE Latin1_General_BIN2 THEN 'Auto: trim/lowercase'
            ELSE 'Valid'
        END AS [Status]
    FROM [dbo].[Link]
)
SELECT [Id], [CurrentFwToken], [NormalizedFwToken], [Status]
FROM TokenReview
WHERE [Status] <> 'Valid'
ORDER BY [Status], [Id];
GO

PRINT 'Potential duplicate tokens after normalization';

WITH NormalizedTokens AS
(
    SELECT
        [Id],
        [FwToken],
        LOWER(LTRIM(RTRIM([FwToken]))) AS [NormalizedFwToken]
    FROM [dbo].[Link]
    WHERE [FwToken] IS NOT NULL
      AND LEN(LTRIM(RTRIM([FwToken]))) = 8
      AND LOWER(LTRIM(RTRIM([FwToken]))) COLLATE Latin1_General_BIN2 NOT LIKE '%[^0-9a-f]%'
),
DuplicateNormalizedTokens AS
(
    SELECT [NormalizedFwToken]
    FROM NormalizedTokens
    GROUP BY [NormalizedFwToken]
    HAVING COUNT(*) > 1
)
SELECT nt.[Id], nt.[FwToken] AS [CurrentFwToken], nt.[NormalizedFwToken]
FROM NormalizedTokens nt
INNER JOIN DuplicateNormalizedTokens d ON d.[NormalizedFwToken] = nt.[NormalizedFwToken]
ORDER BY nt.[NormalizedFwToken], nt.[Id];
GO

BEGIN TRANSACTION;

DECLARE @DuplicateCount int;
DECLARE @UpdatedRows int;
DECLARE @RemainingInvalidCount int;

WITH NormalizedTokens AS
(
    SELECT LOWER(LTRIM(RTRIM([FwToken]))) AS [NormalizedFwToken]
    FROM [dbo].[Link]
    WHERE [FwToken] IS NOT NULL
      AND LEN(LTRIM(RTRIM([FwToken]))) = 8
      AND LOWER(LTRIM(RTRIM([FwToken]))) COLLATE Latin1_General_BIN2 NOT LIKE '%[^0-9a-f]%'
)
SELECT @DuplicateCount = COUNT(*)
FROM
(
    SELECT [NormalizedFwToken]
    FROM NormalizedTokens
    GROUP BY [NormalizedFwToken]
    HAVING COUNT(*) > 1
) AS Duplicates;

IF @DuplicateCount > 0
BEGIN
    THROW 51000, 'Normalization would create duplicate FwToken values. Resolve duplicates shown above before running the update.', 1;
END;

UPDATE [dbo].[Link]
SET [FwToken] = LOWER(LTRIM(RTRIM([FwToken])))
WHERE [FwToken] IS NOT NULL
  AND LEN(LTRIM(RTRIM([FwToken]))) = 8
  AND LOWER(LTRIM(RTRIM([FwToken]))) COLLATE Latin1_General_BIN2 NOT LIKE '%[^0-9a-f]%'
  AND [FwToken] COLLATE Latin1_General_BIN2 <> LOWER(LTRIM(RTRIM([FwToken]))) COLLATE Latin1_General_BIN2;

SET @UpdatedRows = @@ROWCOUNT;

SELECT @RemainingInvalidCount = COUNT(*)
FROM [dbo].[Link]
WHERE [FwToken] IS NULL
   OR LEN([FwToken]) <> 8
   OR [FwToken] COLLATE Latin1_General_BIN2 LIKE '%[^0-9a-f]%';

IF @RemainingInvalidCount > 0
BEGIN
    SELECT
        [Id],
        [FwToken],
        CASE
            WHEN [FwToken] IS NULL THEN 'Manual: token is NULL'
            WHEN LEN([FwToken]) <> 8 THEN 'Manual: token length is not 8'
            WHEN [FwToken] COLLATE Latin1_General_BIN2 LIKE '%[^0-9a-f]%' THEN 'Manual: token is not lowercase hex'
            ELSE 'Manual: unknown invalid state'
        END AS [Status]
    FROM [dbo].[Link]
    WHERE [FwToken] IS NULL
       OR LEN([FwToken]) <> 8
       OR [FwToken] COLLATE Latin1_General_BIN2 LIKE '%[^0-9a-f]%'
    ORDER BY [Id];

    THROW 51001, 'Some FwToken values still require manual remediation. Automatic normalization was rolled back.', 1;
END;

COMMIT TRANSACTION;

SELECT @UpdatedRows AS [UpdatedRows];
GO

PRINT 'Final FwToken validation result';

SELECT
    COUNT(*) AS [InvalidTokenCount]
FROM [dbo].[Link]
WHERE [FwToken] IS NULL
   OR LEN([FwToken]) <> 8
   OR [FwToken] COLLATE Latin1_General_BIN2 LIKE '%[^0-9a-f]%';
GO
