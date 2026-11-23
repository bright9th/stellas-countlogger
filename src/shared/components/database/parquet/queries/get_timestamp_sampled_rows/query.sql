WITH source AS (
    SELECT *
    FROM read_parquet(CONCAT(?, '.parquet'))
),
bounds AS (
    SELECT
        MIN(timestamp) AS min_timestamp,
        MAX(timestamp) AS max_timestamp
    FROM source
),
bucketed AS (
    SELECT
        source.*,
        LEAST(
            CAST(FLOOR(
                (source.timestamp - bounds.min_timestamp)
                / GREATEST(
                    1.0,
                    (bounds.max_timestamp - bounds.min_timestamp)::DOUBLE / ?
                )
            ) AS BIGINT),
            ? - 1
        ) AS bucket_index
    FROM source
    CROSS JOIN bounds
),
ranked AS (
    SELECT
        bucketed.*,
        ROW_NUMBER() OVER (
            PARTITION BY bucket_index
            ORDER BY ABS(
                bucketed.timestamp
                - (
                    bounds.min_timestamp
                    + (bucketed.bucket_index + 0.5)
                    * GREATEST(
                        1.0,
                        (bounds.max_timestamp - bounds.min_timestamp)::DOUBLE / ?
                    )
                )
            ),
            bucketed.id
        ) AS distance_rank
    FROM bucketed
    CROSS JOIN bounds
)
SELECT id, author_id, content, timestamp
FROM ranked
WHERE distance_rank = 1
ORDER BY timestamp, id;
