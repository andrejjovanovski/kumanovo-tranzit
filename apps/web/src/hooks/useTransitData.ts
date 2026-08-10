import { useQuery } from "@tanstack/react-query";
import {
  getLines,
  getLineById,
  getStops,
  getStopById,
  getNeighborhoods,
} from "@kt/data";

/** All lines (with derived timetables). */
export const useLines = () => useQuery({ queryKey: ["lines"], queryFn: getLines });

/** All stops. */
export const useStops = () => useQuery({ queryKey: ["stops"], queryFn: getStops });

/** Neighborhoods (used by search). */
export const useNeighborhoods = () =>
  useQuery({ queryKey: ["neighborhoods"], queryFn: getNeighborhoods });

export const useLine = (id: string | undefined) =>
  useQuery({
    queryKey: ["line", id],
    queryFn: () => getLineById(id as string),
    enabled: !!id,
  });

export const useStop = (id: string | undefined) =>
  useQuery({
    queryKey: ["stop", id],
    queryFn: () => getStopById(id as string),
    enabled: !!id,
  });
