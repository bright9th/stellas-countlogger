WITH numbered AS (
    SELECT *,
        ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM read_parquet(CONCAT(?, '.parquet'))
)
SELECT *
FROM numbered
WHERE rn % ? = 0
LIMIT ?;
