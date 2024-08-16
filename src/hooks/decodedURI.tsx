import { useParams, useSearchParams } from "@solidjs/router";
import { createMemo } from "solid-js";

export function useDecodedParams() {
  const useDecodedParams = createMemo(() => {
    const params = useParams();
    const record: Record<string, string> = {};
    Object.keys(params).forEach(
      (key) => (record[key] = decodeURI(params[key]!))
    );
    return record;
  });
  return useDecodedParams;
}
export function useDecodedSearchParams() {
  const useDecodedSearchParams = createMemo(() => {
    const [searchParams] = useSearchParams();
    const record: Record<string, string> = {};
    Object.keys(searchParams).forEach(
      (key) => (record[key] = decodeURI(searchParams[key]!))
    );
    return record;
  });
  return useDecodedSearchParams;
}
