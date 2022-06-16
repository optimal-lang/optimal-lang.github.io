import $path from "https://jspm.dev/path";

export function printAsJson(x, title) {
    let json = JSON.stringify(x, null, "  ");
    if (title === undefined)
        console.log(json);
    else
        console.log(title + ": " + json);
}

export function writeAsJson(path, x) {
    Deno.writeTextFileSync(
        path,
        JSON.stringify(x, null, "  ")
    );
}

export function parsePath(path) {
    path = path.replace(/\\/g, "/");
    let result = $path.parse(path);
    result.path = result.dir + "/" + result.base;
    return result;
}
