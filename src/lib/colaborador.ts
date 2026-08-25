export type Colaborador = {
  nome: string;
  email: string;
  area: string;
};

const CHAVE = "chlorum.colaborador";

export function salvarColaborador(c: Colaborador) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CHAVE, JSON.stringify(c));
}

export function lerColaborador(): Colaborador | null {
  if (typeof window === "undefined") return null;
  try {
    const bruto = sessionStorage.getItem(CHAVE);
    return bruto ? (JSON.parse(bruto) as Colaborador) : null;
  } catch {
    return null;
  }
}

export function limparColaborador() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CHAVE);
}
