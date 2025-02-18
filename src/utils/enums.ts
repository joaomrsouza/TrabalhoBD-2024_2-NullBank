export const ufs = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

export type UF = (typeof ufs)[number];

export const TiposConta = ["especial", "corrente", "poupança"] as const;
export type TipoConta = (typeof TiposConta)[number];

export const Parentescos = ["filho(a)", "cônjuge", "genitor(a)"] as const;
export type Parentesco = (typeof Parentescos)[number];

export const Generos = ["masculino", "feminino", "não-binário"] as const;
export type Genero = (typeof Generos)[number];

export const Cargos = ["gerente", "atendente", "caixa"] as const;
export type Cargo = (typeof Cargos)[number];

export const ObjectsSearch = ["agencia", "funcionario"] as const;
export type ObjectSearch = (typeof ObjectsSearch)[number];
