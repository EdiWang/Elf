SET XACT_ABORT ON;
GO

-- Batch 2 migration for existing Elf databases.
-- Run the duplicate checks first. If any query returns rows, resolve those duplicates before creating indexes.

SELECT [FwToken], COUNT(*) AS [DuplicateCount]
FROM [dbo].[Link]
WHERE [FwToken] IS NOT NULL
GROUP BY [FwToken]
HAVING COUNT(*) > 1;
GO

SELECT [AkaName], COUNT(*) AS [DuplicateCount]
FROM [dbo].[Link]
WHERE [AkaName] IS NOT NULL
GROUP BY [AkaName]
HAVING COUNT(*) > 1;
GO

SELECT [Name], COUNT(*) AS [DuplicateCount]
FROM [dbo].[Tag]
GROUP BY [Name]
HAVING COUNT(*) > 1;
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Link_FwToken' AND object_id = OBJECT_ID(N'[dbo].[Link]'))
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX [IX_Link_FwToken]
    ON [dbo].[Link] ([FwToken] ASC)
    WHERE [FwToken] IS NOT NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Link_AkaName' AND object_id = OBJECT_ID(N'[dbo].[Link]'))
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX [IX_Link_AkaName]
    ON [dbo].[Link] ([AkaName] ASC)
    WHERE [AkaName] IS NOT NULL;
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Link_UpdateTimeUtc' AND object_id = OBJECT_ID(N'[dbo].[Link]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_Link_UpdateTimeUtc]
    ON [dbo].[Link] ([UpdateTimeUtc] DESC);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_LinkTracking_LinkId_RequestTimeUtc' AND object_id = OBJECT_ID(N'[dbo].[LinkTracking]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_LinkTracking_LinkId_RequestTimeUtc]
    ON [dbo].[LinkTracking] ([LinkId] ASC, [RequestTimeUtc] DESC);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_LinkTracking_RequestTimeUtc' AND object_id = OBJECT_ID(N'[dbo].[LinkTracking]'))
BEGIN
    CREATE NONCLUSTERED INDEX [IX_LinkTracking_RequestTimeUtc]
    ON [dbo].[LinkTracking] ([RequestTimeUtc] DESC);
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Tag_Name' AND object_id = OBJECT_ID(N'[dbo].[Tag]'))
BEGIN
    CREATE UNIQUE NONCLUSTERED INDEX [IX_Tag_Name]
    ON [dbo].[Tag] ([Name] ASC);
END
GO
