import { apiURL } from './loader';

export const stream = new EventSource(apiURL + 'stream');
