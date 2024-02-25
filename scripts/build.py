from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

# To avoid complexity of modules, just append all scripts to path
sys.path.append(os.path.normpath(os.path.dirname(__file__)))

import utilities as util
from jinja2 import Environment, FileSystemLoader

project_base_path = Path(__file__).parent.parent

template_dir = project_base_path / "src" / "templates"
jinja_env = Environment(autoescape=True, loader=FileSystemLoader(template_dir))


@dataclass
class NavItem:
  name: str
  target_slug: str
  children: list[NavItem]
  protected = False


main_menu = [
  NavItem("Home", "", []),
  NavItem("Gallery", "gallery.html", []),
  NavItem("Blog", "blog.html", []),
  NavItem("Shop", "shop.html", []),
  NavItem("Contact", "contact.html", []),
]


def classes(*args):
  """
  Global jinja helper function that concatenates conditional class names.

  Example (in a .jinja template):
  This would have a class of bg-red-400 text-green-400
  (bg-blue-500 is excluded due to being falsy)
  ```html
  <div class="{{classes(1==1 and 'bg-red-400', 'text-green-400', False and 'bg-blue-500')}}">
    Test
  </div>
  ```
  """
  return " ".join(filter(None, args))


jinja_env.globals.update(
  {
    "classes": classes,
    # When mounted under "/app" routes call "app/lib" for static content instead of "/lib"
    "base_path_reset": "../",
    "main_menu": main_menu,
  }
)


def build(clean=False):
  src = project_base_path / "src"
  build_base_path = project_base_path / "public"

  if clean and build_base_path.exists():
    shutil.rmtree(
      build_base_path,
    )

  os.makedirs(build_base_path, exist_ok=True)
  os.makedirs(build_base_path / "lib", exist_ok=True)

  # Copy lib static files to public dir only on clean build
  if clean:
    shutil.copytree(src / "static" / "lib", build_base_path / "lib", dirs_exist_ok=True)

  for pathname in os.listdir(src / "static"):
    # Lib folder handled separately, skip input css file
    if pathname == "lib" or pathname == "input.css":
      continue

    if pathname == "img":
      shutil.copytree(
        src / "static" / pathname, build_base_path / pathname, dirs_exist_ok=True
      )
    else:
      shutil.copy(src / "static" / pathname, build_base_path / pathname)

  for template in os.listdir(template_dir / "pages"):
    template_path = template_dir / "pages" / template
    rendered_page = jinja_env.get_template(f"pages/{template}").render()

    with (build_base_path / f"{template_path.stem}.html").open(
      "w", encoding="utf-8"
    ) as f:
      f.write(rendered_page)


if __name__ == "__main__":
  parser = argparse.ArgumentParser()
  parser.add_argument(
    "--clean", action="store_true", help="Clean the public folder before rebuilding"
  )
  (args, _) = parser.parse_known_args()

  t0 = datetime.now()
  util.cprint("Rebuilding...", util.CColors.WARNING)
  build(clean=args.clean)
  subprocess.run(
    ["./tailwindcss", "-i", "./src/static/input.css", "-o", "./public/output.css"],
    check=True,
  )
  util.cprint(
    f"Done in {round((datetime.now() - t0).total_seconds(), 4) * 1000}ms",
    util.CColors.OKCYAN,
  )
