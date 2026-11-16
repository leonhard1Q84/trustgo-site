const DAY = 86_400_000;
const RETENTION = 7 * DAY;

/** Demo records expire after seven days; physical cleanup runs on the next access. */
export function pruneDemoSnapshot(namespaces: Record<string, object>, now = Date.now()) {
  const prune = (value: unknown, field: string) => {
    if (!(value instanceof Map)) return;
    for (const [key, record] of value) {
      let expires = Infinity;
      if (typeof record === 'number') {
        if (field === 'sessions') expires = record;
        if (field === 'lastChallengeSentAt') expires = record + 10 * 60_000;
      } else if (record && typeof record === 'object') {
        if (typeof record.expires === 'number') expires = record.expires + (field === 'rates' ? DAY : 0);
        if (typeof record.expires_at === 'number') expires = Math.min(expires, record.expires_at);
        const created = record.created_at ?? record.createdAt;
        if (typeof created === 'string') expires = Math.min(expires, Date.parse(created) + RETENTION);
        if (typeof created === 'number') expires = Math.min(expires, created + RETENTION);
      }
      if (expires <= now) value.delete(key);
    }
  };
  for (const namespace of Object.values(namespaces)) {
    if (namespace instanceof Map) prune(namespace, 'limits');
    else for (const [field, value] of Object.entries(namespace)) prune(value, field);
  }
  const accounts = namespaces.accounts as { accounts?: Map<string, unknown>; emailIndex?: Map<string, string> } | undefined;
  if (accounts?.accounts && accounts.emailIndex) {
    for (const [email, id] of accounts.emailIndex) if (!accounts.accounts.has(id)) accounts.emailIndex.delete(email);
  }
}
