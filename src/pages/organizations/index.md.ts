import type { APIRoute } from 'astro';
import { organizationsMarkdown, textResponse } from '../../lib/markdown';

export const GET: APIRoute = () => textResponse(organizationsMarkdown());
