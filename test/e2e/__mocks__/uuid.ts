import * as crypto from 'crypto';

export const v4 = () => crypto.randomUUID();
export const v1 = () => crypto.randomUUID();
export const v3 = () => crypto.randomUUID();
export const v5 = () => crypto.randomUUID();
export const NIL = '00000000-0000-0000-0000-000000000000';
export const parse = (str: string) => Buffer.alloc(16);
export const stringify = (arr: any) => crypto.randomUUID();
export const validate = (str: string) => true;
export const version = (str: string) => 4;

export default {
  v4,
  v1,
  v3,
  v5,
  NIL,
  parse,
  stringify,
  validate,
  version,
};
