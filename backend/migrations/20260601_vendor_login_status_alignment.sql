UPDATE users u
SET
    is_vendor = TRUE,
    role = 'vendor',
    vendor_status = v.verification_status,
    approved_at = CASE
        WHEN v.verification_status = 'approved'
        THEN COALESCE(u.approved_at, v.updated_at, CURRENT_TIMESTAMP)
        ELSE u.approved_at
    END,
    updated_at = CURRENT_TIMESTAMP
FROM vendors v
WHERE v.user_id = u.id
  AND COALESCE(v.is_deleted, FALSE) = FALSE
  AND v.verification_status IN (
      'pending',
      'approved',
      'rejected',
      'suspended'
  )
  AND (
      COALESCE(u.is_vendor, FALSE) = FALSE
      OR COALESCE(u.role, '') <> 'vendor'
      OR COALESCE(u.vendor_status, 'none') <> v.verification_status
  );
