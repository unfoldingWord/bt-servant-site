// Cloudflare Pages Function for "/organizations/": same as functions/index.js.
import { negotiate } from '../../src/lib/negotiate.js';

export const onRequest = (context) => negotiate(context, '/organizations/index.md');
