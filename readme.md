## TODO: 
Create prod build script (and cloudflare cache purge via api)
Test updated contactform code (long messages get multiple discord messages)
- Later:
Blog setup
Shop setup


## Mentality
A minimal, simple static site builder using my own python code. Because it is built, I can leverage jinja (creating reusable layouts and components), and tailwindcss for easy design. I use alpine for interactivity simplification, already included in `src/static/lib/alpinejs.min.js`.

Scripts in the `scripts` directory, including the build script, use only one library, `jinja2`. **Everything else is python standard library**. I also don't use python modules (appending sys.path instead) to avoid module complexities.

`tailwindcss` is the [standalone tailwindcss executable](https://tailwindcss.com/blog/standalone-cli), which I keep in github also to simplify setup.

The build process is fully local, we use [Cloudflare Pages](https://developers.cloudflare.com/pages/) only to host the resulting `/public` directory (which is included in github), and leverage their `/functions` folder for backend code on Cloudflare Workers, which is also simple JS with no libraries.

By keeping it this simple and using minimal libraries, this should be much more simple to maintain and update. All js dependencies are static (the alpine lib is just the script in `src/static/lib` and tailwindcss already has a premade exe), so I don't have to worry about node, but still get all the benefits.


## Initial Setup

Create and activate environment.

```bash
# Can also use mamba
$ conda create --prefix ./env python=3.11
$ python -m pip install -r requirements.txt
$ conda activate ./env
```

Create a project in Cloudflare pages and link to github repo.

Build and push project to github and the site (including any Cloudflare Workers in `/functions`) is live on Cloudflare with no further action needed! Lovely.


## Workflow

```bash
# Builds the site and starts a file watcher to rebuild on /src change, then starts a python static server, which watches /public to restart.
$ ./dev-build.sh
# Manually build site
$ python ./scripts/build.py
# Manually first clear the /public dir, then rebuild
$ python ./scripts/build.py --clean
```

All files in `src/static` are copied as is to the public folder (not into a static subfolder). `/img` contains all images, `/lib` contains all vendor files (js, css, font files, etc). The files in the base static folder would be my global css and js files. `/src/static/input.css` is the input to tailwindcss, which outputs to `/public/output.css` at build time.

The `src/templates` folder contains all jinja templates. `src/*.jinja` templates are layouts and utilities. `src/pages/*.jinja` contain all the individual pages that will be generated (to a route matching their file name). `src/components/*.jinja` are all the components used within the pages files.

The build process moves the static folder as described, renders all templates in `src/templates/pages` and puts them in `/public`, then tailwind processes the css input file. 

Tailwind config has my content folder set to `src/templates/**/*.jinja`, so I can use tailwind utility classes in any template and it processes them into the output file.

In `build.py`, I can set my navigation items, which my navbar component uses to build.

When pushing to github, the built `/public` directory is also included, which allows Cloudflare Pages to publish the `/public` without worrying about a build step in the cloud. Pushing to origin main publishes a new version of the site, pushing a new branch creates a preview URL.

The `/functions` directory uses [Cloudflare Pages functions](https://developers.cloudflare.com/pages/functions/), which are just simple js workers. We can add sprinkles of backend functionality this way (the file name is the route). It is also built and set up automatically when we push our repo.