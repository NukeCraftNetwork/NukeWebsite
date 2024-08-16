/// <reference types="@solidjs/start/env" />
// Utility types
type ExtractPromiseType<T> = T extends Promise<infer U> ? U : never;
type ExtractArrayElementType<T> = T extends (infer U)[] ? U : never;
