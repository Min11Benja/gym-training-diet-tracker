/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as coach from "../coach.js";
import type * as http from "../http.js";
import type * as metrics from "../metrics.js";
import type * as nutrition from "../nutrition.js";
import type * as progress from "../progress.js";
import type * as seed from "../seed.js";
import type * as users from "../users.js";
import type * as workoutPlans from "../workoutPlans.js";
import type * as workouts from "../workouts.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  coach: typeof coach;
  http: typeof http;
  metrics: typeof metrics;
  nutrition: typeof nutrition;
  progress: typeof progress;
  seed: typeof seed;
  users: typeof users;
  workoutPlans: typeof workoutPlans;
  workouts: typeof workouts;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
