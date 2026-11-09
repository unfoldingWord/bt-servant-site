import type { APIRoute } from 'astro';
import { homeMarkdown, textResponse } from '../lib/markdown';

export const GET: APIRoute = () => textResponse(homeMarkdown());
