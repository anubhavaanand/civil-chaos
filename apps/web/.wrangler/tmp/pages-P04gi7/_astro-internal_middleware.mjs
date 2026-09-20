globalThis.process ??= {}; globalThis.process.env ??= {};
import './chunks/astro-designed-error-pages_Cw40yXNO.mjs';
import { a as ACTION_QUERY_PARAMS, s as serializeActionResult } from './chunks/shared_BnCbmBJD.mjs';
import { d as defineMiddleware, g as getOriginPathname, s as sequence } from './chunks/render-context_C4Kp2lmh.mjs';
import { y as yellow } from './chunks/astro/server_Dud8S12r.mjs';
import { h as hasContentType, f as formContentTypes, A as ACTION_API_CONTEXT_SYMBOL } from './chunks/utils_C9aeIuEK.mjs';
import { getAction } from './chunks/get-action_DCLcjaxO.mjs';

const When = {
                	Client: 'client',
                	Server: 'server',
                	Prerender: 'prerender',
                	StaticBuild: 'staticBuild',
                	DevServer: 'devServer',
              	};
            	
              const isBuildContext = Symbol.for('astro:when/buildContext');
              const whenAmI = globalThis[isBuildContext] ? When.Prerender : When.Server;

const middlewares = {
  [When.Client]: () => {
    throw new Error("Client should not run a middleware!");
  },
  [When.DevServer]: (_, next) => next(),
  [When.Server]: (_, next) => next(),
  [When.Prerender]: (ctx, next) => {
    if (ctx.locals.runtime === void 0) {
      ctx.locals.runtime = {
        env: process.env
      };
    }
    return next();
  },
  [When.StaticBuild]: (_, next) => next()
};
const onRequest$2 = middlewares[whenAmI];

const onRequest$1 = defineMiddleware(async (context, next) => {
  if (context._isPrerendered) {
    if (context.request.method === "POST") {
      console.warn(
        yellow("[astro:actions]"),
        "POST requests should not be sent to prerendered pages. If you're using Actions, disable prerendering with `export const prerender = false`."
      );
    }
    return next();
  }
  const locals = context.locals;
  if (locals._actionPayload) return next();
  const actionPayload = context.cookies.get(ACTION_QUERY_PARAMS.actionPayload)?.json();
  if (actionPayload) {
    if (!isActionPayload(actionPayload)) {
      throw new Error("Internal: Invalid action payload in cookie.");
    }
    return renderResult({ context, next, ...actionPayload });
  }
  const actionName = context.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
  if (context.request.method === "POST" && actionName) {
    return handlePost({ context, next, actionName });
  }
  return next();
});
async function renderResult({
  context,
  next,
  actionResult,
  actionName
}) {
  const locals = context.locals;
  locals._actionPayload = { actionResult, actionName };
  const response = await next();
  context.cookies.delete(ACTION_QUERY_PARAMS.actionPayload);
  if (actionResult.type === "error") {
    return new Response(response.body, {
      status: actionResult.status,
      statusText: actionResult.type,
      headers: response.headers
    });
  }
  return response;
}
async function handlePost({
  context,
  next,
  actionName
}) {
  const { request } = context;
  const baseAction = await getAction(actionName);
  const contentType = request.headers.get("content-type");
  let formData;
  if (contentType && hasContentType(contentType, formContentTypes)) {
    formData = await request.clone().formData();
  }
  const { getActionResult, callAction, props, redirect, ...actionAPIContext } = context;
  Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
  const action = baseAction.bind(actionAPIContext);
  const actionResult = await action(formData);
  if (context.url.searchParams.get(ACTION_QUERY_PARAMS.actionRedirect) === "false") {
    return renderResult({
      context,
      next,
      actionName,
      actionResult: serializeActionResult(actionResult)
    });
  }
  return redirectWithResult({ context, actionName, actionResult });
}
async function redirectWithResult({
  context,
  actionName,
  actionResult
}) {
  context.cookies.set(ACTION_QUERY_PARAMS.actionPayload, {
    actionName,
    actionResult: serializeActionResult(actionResult)
  });
  if (actionResult.error) {
    const referer2 = context.request.headers.get("Referer");
    if (!referer2) {
      throw new Error("Internal: Referer unexpectedly missing from Action POST request.");
    }
    return context.redirect(referer2);
  }
  const referer = getOriginPathname(context.request);
  if (referer) {
    return context.redirect(referer);
  }
  return context.redirect(context.url.pathname);
}
function isActionPayload(json) {
  if (typeof json !== "object" || json == null) return false;
  if (!("actionResult" in json) || typeof json.actionResult !== "object") return false;
  if (!("actionName" in json) || typeof json.actionName !== "string") return false;
  return true;
}

const onRequest = sequence(
	onRequest$2,
	
	onRequest$1
);

export { onRequest };
