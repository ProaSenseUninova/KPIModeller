/* ****************************************************************************************** */
/* *********************************** HOURLY *********************************************** */
/* ****************************************************************************************** */
/* Count parts per hour per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 1 kpiid, 4 gran1, COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date1
FROM "kpi_values" kv
WHERE "granularity_id" IS NULL
AND ("kpi_id" = 2 OR "kpi_id" = 3)
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Count parts per hour global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 1 kpiid, 4 gran1, COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date1
FROM "kpi_values" kv
WHERE "granularity_id" IS NULL
AND ("kpi_id" = 2 OR "kpi_id" = 3)
GROUP BY Date1
ORDER BY Date1;

/* Good parts per hour per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 2 kpiid, 4 gran1, COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 2
AND "granularity_id" IS NULL
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Good parts per hour per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 2 kpiid, 4 gran1, COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 2
AND "granularity_id" IS NULL
GROUP BY Date1
ORDER BY Date1;

/* Scrap parts per hour per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 3 kpiid, 4 gran1, COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 3
AND "granularity_id" IS NULL
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Scrap parts per hour per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 3 kpiid, 4 gran1, COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 3
AND "granularity_id" IS NULL
GROUP BY Date1
ORDER BY Date1;

/* Scrapped rate per hour per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 4 kpiid, 4 gran1, Count2/Count1 Scrapped, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, "machine_id" "mid2", "product_id" "pid2", "mould_id" "mlid2", "shift_id" "shid2", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 3
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
AND "mid1" = "mid2"
AND "pid1" = "pid2"
AND "mlid1" = "mlid2"
AND "shid1" = "shid2"
ORDER BY DateA, "mid1", "pid1", "mlid1", "shid1";

/* Scrapped rate per hour global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 4 kpiid, 4 gran1, Count2/Count1 Scrapped, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, NULL "mid2", NULL "pid2", NULL "mlid2", NULL "shid2", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 3
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
ORDER BY DateA;

/* Quality per hour per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 7 kpiid, 4 gran1, Count2/Count1 Quality, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, "machine_id" "mid2", "product_id" "pid2", "mould_id" "mlid2", "shift_id" "shid2", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 2
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
AND "mid1" = "mid2"
AND "pid1" = "pid2"
AND "mlid1" = "mlid2"
AND "shid1" = "shid2"
ORDER BY DateA, "mid1", "pid1", "mlid1", "shid1";

/* Quality per hour per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 7 kpiid, 4 gran1, Count2/Count1 Quality, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, NULL "mid2", NULL "pid2", NULL "mlid2", NULL "shid2", CAST(CONCAT(CAST(kv."timestamp"AS DATE), ' ', HOUR(CAST(kv."timestamp" AS TIME)), ':00:00') AS TIMESTAMP) Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 2
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
ORDER BY DateA;

/* ****************************************************************************************** */
/* *********************************** DAILY ************************************************ */
/* ****************************************************************************************** */
/* Count parts per day per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 1 kpiid, 3 gran1, COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date1
FROM "kpi_values" kv
WHERE "granularity_id" IS NULL
AND ("kpi_id" = 2 OR "kpi_id" = 3)
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Count parts per day per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 1 kpiid, 3 gran1, COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date1
FROM "kpi_values" kv
WHERE "granularity_id" IS NULL
AND ("kpi_id" = 2 OR "kpi_id" = 3)
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Good parts per day per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 2 kpiid, 3 gran1, COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 2
AND "granularity_id" IS NULL
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Good parts per day per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 2 kpiid, 3 gran1, COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 2
AND "granularity_id" IS NULL
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Scrap parts per day per all contexts */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 3 kpiid, 3 gran1, COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 3
AND "granularity_id" IS NULL
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Scrap parts per day per global */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 3 kpiid, 3 gran1, COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 3
AND "granularity_id" IS NULL
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1";

/* Scrapped rate per day per all contexts */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 4 kpiid, 3 gran1, Count2/Count1 Scrapped, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, "machine_id" "mid2", "product_id" "pid2", "mould_id" "mlid2", "shift_id" "shid2", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 3
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
AND "mid1" = "mid2"
AND "pid1" = "pid2"
AND "mlid1" = "mlid2"
AND "shid1" = "shid2"
ORDER BY DateA, "mid1", "pid1", "mlid1", "shid1";

/* Scrapped rate per day per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 4 kpiid, 3 gran1, Count2/Count1 Scrapped, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, NULL "mid2", NULL "pid2", NULL "mlid2", NULL "shid2", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 3
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
ORDER BY DateA;

/* Quality per day per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 7 kpiid, 3 gran1, Count2/Count1 Quality, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, "machine_id" "mid2", "product_id" "pid2", "mould_id" "mlid2", "shift_id" "shid2", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 2
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
AND "mid1" = "mid2"
AND "pid1" = "pid2"
AND "mlid1" = "mlid2"
AND "shid1" = "shid2"
ORDER BY DateA, "mid1", "pid1", "mlid1", "shid1";

/* Quality per day per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 7 kpiid, 3 gran1, Count2/Count1 Quality, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, NULL "mid2", NULL "pid2", NULL "mlid2", NULL "shid2", CAST(CONCAT(CAST(kv."timestamp" AS DATE), ' 00:00:00') AS TIMESTAMP) as Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 2
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
ORDER BY DateA;

/* ****************************************************************************************** */
/* *********************************** WEEKLY *********************************************** */
/* ****************************************************************************************** */
/* Count parts per week per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 1 kpiid, 2 gran1, COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date1
FROM "kpi_values" kv
WHERE "granularity_id" IS NULL
AND ("kpi_id" = 2 OR "kpi_id" = 3)
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Count parts per week per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 1 kpiid, 2 gran1, COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date1
FROM "kpi_values" kv
WHERE "granularity_id" IS NULL
AND ("kpi_id" = 2 OR "kpi_id" = 3)
GROUP BY Date1
ORDER BY Date1;

/* Good parts per week per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 2 kpiid, 2 gran1, COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 2
AND "granularity_id" IS NULL
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Good parts per week per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 2 kpiid, 2 gran1, COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 2
AND "granularity_id" IS NULL
GROUP BY Date1
ORDER BY Date1;

/* Scrap parts per week per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 3 kpiid, 2 gran1, COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 3
AND "granularity_id" IS NULL
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Scrap parts per week per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 3 kpiid, 2 gran1, COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 3
AND "granularity_id" IS NULL
GROUP BY Date1
ORDER BY Date1;

/* Scrapped rate per week per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 4 kpiid, 2 gran1, Count2/Count1 Scrapped, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, "machine_id" "mid2", "product_id" "pid2", "mould_id" "mlid2", "shift_id" "shid2", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 3
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
AND "mid1" = "mid2"
AND "pid1" = "pid2"
AND "mlid1" = "mlid2"
AND "shid1" = "shid2"
ORDER BY DateA, "mid1", "pid1", "mlid1", "shid1";

/* Scrapped rate per week per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 4 kpiid, 2 gran1, Count2/Count1 Scrapped, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, NULL "mid2", NULL "pid2", NULL "mlid2", NULL "shid2", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 3
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
ORDER BY DateA;

/* Quality per week per all contexts */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 7 kpiid, 2 gran1, Count2/Count1 Quality, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, "machine_id" "mid2", "product_id" "pid2", "mould_id" "mlid2", "shift_id" "shid2", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 2
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
AND "mid1" = "mid2"
AND "pid1" = "pid2"
AND "mlid1" = "mlid2"
AND "shid1" = "shid2"
ORDER BY DateA, "mid1", "pid1", "mlid1", "shid1";

/* Quality per week per global */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 7 kpiid, 2 gran1, Count2/Count1 Quality, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, NULL "mid2", NULL "pid2", NULL "mlid2", NULL "shid2", CASEWHEN((WEEK(kv."timestamp")=1) AND (MONTH(kv."timestamp")>1), TIMESTAMP(CONCAT(DATEADD('day', 51*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00')), TIMESTAMP(CONCAT(DATEADD('day', (WEEK(kv."timestamp")-1)*7, CAST(CONCAT(YEAR(kv."timestamp"), '-01-01')AS DATE)), ' 00:00:00'))) Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 2
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
ORDER BY DateA;

/* ****************************************************************************************** */
/* *********************************** MONTHLY ********************************************** */
/* ****************************************************************************************** */
/* Count parts per month per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 1 kpiid, 1 gran1, COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date1
FROM "kpi_values" kv
WHERE "granularity_id" IS NULL
AND ("kpi_id" = 2 OR "kpi_id" = 3)
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Count parts per month per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 1 kpiid, 1 gran1, COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date1
FROM "kpi_values" kv
WHERE "granularity_id" IS NULL
AND ("kpi_id" = 2 OR "kpi_id" = 3)
GROUP BY Date1
ORDER BY Date1;

/* Good parts per month per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 2 kpiid, 1 gran1, COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 2
AND "granularity_id" IS NULL
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Good parts per month per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 2 kpiid, 1 gran1, COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 2
AND "granularity_id" IS NULL
GROUP BY Date1
ORDER BY Date1;

/* Scrap parts per month per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 3 kpiid, 1 gran1, COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 3
AND "granularity_id" IS NULL
GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
ORDER BY Date1;

/* Scrap parts per month per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 3 kpiid, 1 gran1, COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date1
FROM "kpi_values" kv
WHERE "kpi_id" = 3
AND "granularity_id" IS NULL
GROUP BY Date1
ORDER BY Date1;

/* Scrapped rate per month per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 4 kpiid, 1 gran1, Count2/Count1 Scrapped, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, "machine_id" "mid2", "product_id" "pid2", "mould_id" "mlid2", "shift_id" "shid2", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 3
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
AND "mid1" = "mid2"
AND "pid1" = "pid2"
AND "mlid1" = "mlid2"
AND "shid1" = "shid2"
ORDER BY DateA, "mid1", "pid1", "mlid1", "shid1";

/* Scrapped rate per month per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 4 kpiid, 1 gran1, Count2/Count1 Scrapped, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, NULL "mid2", NULL "pid2", NULL "mlid2", NULL "shid2", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 3
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
ORDER BY DateA;

/* Quality per month per all contexts - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 7 kpiid, 1 gran1, Count2/Count1 Quality, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, "machine_id" "mid1", "product_id" "pid1", "mould_id" "mlid1", "shift_id" "shid1", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, "machine_id" "mid2", "product_id" "pid2", "mould_id" "mlid2", "shift_id" "shid2", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 2
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
AND "mid1" = "mid2"
AND "pid1" = "pid2"
AND "mlid1" = "mlid2"
AND "shid1" = "shid2"
ORDER BY DateA, "mid1", "pid1", "mlid1", "shid1";

/* Quality per month per global - OK */
INSERT INTO "kpi_values" ("kpi_id", "granularity_id", "value", "machine_id", "product_id", "mould_id", "shift_id", "timestamp")
SELECT 7 kpiid, 1 gran1, Count2/Count1 Quality, "mid1", "pid1", "mlid1", "shid1", Date1 DateA FROM (
SELECT COUNT(*) Count1, NULL "mid1", NULL "pid1", NULL "mlid1", NULL "shid1", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date1
	FROM "kpi_values" kv
	WHERE "granularity_id" IS NULL
	GROUP BY Date1, "mid1", "pid1", "mlid1", "shid1"
), (
SELECT COUNT(*) Count2, NULL "mid2", NULL "pid2", NULL "mlid2", NULL "shid2", CAST(CONCAT(YEAR(CAST(kv."timestamp" AS DATE)), '-', MONTH(CAST(kv."timestamp" AS DATE)), '-01 00:00:00') AS TIMESTAMP) Date2
	FROM "kpi_values" kv
	WHERE "kpi_id" = 2
	AND "granularity_id" IS NULL
	GROUP BY Date2, "mid2", "pid2", "mlid2", "shid2"
) 
WHERE Date1 = Date2
ORDER BY DateA;



/* ** template for global ** */
SELECT 'Global', "value" value, kv."timestamp" date1
FROM "kpi_values" 
WHERE "granularity_id" = ?
AND "kpi_id" = ?
AND "machine_id" IS NULL
AND "product_id" IS NULL
AND "mould_id" IS NULL
AND "shift_id" IS NULL
ORDER BY date1

/* ** template for per context ** */
SELECT ct."name", SUM("value") value, kv."timestamp" date1
FROM "kpi_values" kv
LEFT OUTER JOIN "mould" ct ON "mould_id"=ct."id"
WHERE "kpi_id" = 1
AND "granularity_id" = 1
AND "mould_id" IS NOT NULL
GROUP BY date1, ct."name"
ORDER BY date1
