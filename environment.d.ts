declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPRESS_PORT: string;
    }
  }
}

export {};
