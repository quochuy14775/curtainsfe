type ODataOptions = {
  filter?: string | string[];
  orderby?: string;
  top?: number;
  skip?: number;
  count?: boolean;
  select?: string[];
  expand?: string[];
};

export function buildODataQuery(options: ODataOptions): string {
  const params: string[] = [];

  if (options.count) params.push("$count=true");
  if (options.top !== undefined) params.push(`$top=${options.top}`);
  if (options.skip !== undefined) params.push(`$skip=${options.skip}`);
  if (options.orderby) params.push(`$orderby=${options.orderby}`);
  if (options.select?.length) params.push(`$select=${options.select.join(",")}`);
  if (options.expand?.length) params.push(`$expand=${options.expand.join(",")}`);

  if (options.filter) {
    const clauses = Array.isArray(options.filter) ? options.filter : [options.filter];
    const combined = clauses.filter(Boolean).join(" and ");
    if (combined) params.push(`$filter=${combined}`);
  }

  return params.join("&");
}

// ── Filter clause helpers ──────────────────────────────────────────────────

export function contains(field: string, value: string): string {
  return `contains(tolower(${field}),'${value.toLowerCase().replace(/'/g, "''")}')`;
}

export function eq(field: string, value: string | number): string {
  return typeof value === "string" ? `${field} eq '${value}'` : `${field} eq ${value}`;
}

export function gt(field: string, value: number): string {
  return `${field} gt ${value}`;
}

export function lt(field: string, value: number): string {
  return `${field} lt ${value}`;
}

export function and(...clauses: (string | undefined)[]): string {
  return clauses.filter(Boolean).join(" and ");
}

export function or(...clauses: (string | undefined)[]): string {
  return `(${clauses.filter(Boolean).join(" or ")})`;
}
