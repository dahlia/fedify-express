@fedify/express: Integrate Fedify with Express
==============================================

[![npm][npm badge]][npm]
[![Matrix][Matrix badge]][Matrix]
[![Follow @fedify@hollo.social][@fedify@hollo.social badge]][@fedify@hollo.social]

This package provides a simple way to integrate [Fedify] with [Express].

The integration code looks like this:

~~~~ typescript
import express from "express";
import { integrateFederation } from "@fedify/express";
import { federation } from "./federation";  // Your `Federation` instance

export const app = express();

app.set("trust proxy", true);

app.use(integrateFederation(federation, (req) => "context data goes here"));
~~~~

[npm]: https://www.npmjs.com/package/@fedify/express
[npm badge]: https://img.shields.io/npm/v/@fedify/express?logo=npm
[Matrix]: https://matrix.to/#/#fedify:matrix.org
[Matrix badge]: https://img.shields.io/matrix/fedify%3Amatrix.org
[@fedify@hollo.social badge]: https://fedi-badge.deno.dev/@fedify@hollo.social/followers.svg
[@fedify@hollo.social]: https://hollo.social/@fedify
[Fedify]: https://fedify.dev/
[Express]: https://expressjs.com/


Changelog
---------

### Version 0.1.5

To be released.

 -  Relaxed the requirement for the peer dependency `@fedify/fedify` to allow
    any version under 2.0.0.

### Version 0.1.4

Released on August 31, 2024.

 -  Fixed a bug where it throws `TypeError` with message <q>RequestInit: duplex
    option is required when sending a body.</q>

### Version 0.1.3

Released on August 5, 2024.

 -  Fixed the middleware to not fill `Request.body` when the request method is
    `GET` or `HEAD`.
 -  Fixed the middleware to content-negotiate the response based on
    the `Accept` header.

### Version 0.1.2

Released on August 5, 2024.

 -  Fixed incorrectly configured export targets in *package.json*.

### Version 0.1.1

Released on August 5, 2024.

 -  Added missing entry points to the *package.json*.

### Version 0.1.0

Initial release.  Released on August 5, 2024.
