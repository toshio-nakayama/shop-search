SELECT
  count(*) as count
FROM
  t_user
WHERE email LIKE ?
