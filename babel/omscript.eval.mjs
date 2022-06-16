import * as common from "./omscript.common.mjs";

export function compile_ast(ast) {
    common.printAsJson(ast.type, "ast.type");
    common.printAsJson(ast, "ast");
    switch (ast.type) {
        case "FunctionDeclaration": {
            common.printAsJson("FunctionDeclaration found");
            for (let param of ast.params) {
                common.printAsJson(param.name, "FunctionDeclaration(param)");
            }
            for (let step of ast.body.body) {
                common.printAsJson(step, "FunctionDeclaration(step)");
                compile_ast(step);
            }
        } break;
        case "ReturnStatement": {
            common.printAsJson(ast.argument, "Returned");
            compile_ast(ast.argument);
        } break;
        case "BinaryExpression": {
            common.printAsJson(ast.left, "BinaryExpression.left");
            common.printAsJson(ast.right, "BinaryExpression.right");
            compile_ast(ast.left);
            compile_ast(ast.right);
        } break;
        case "Identifier": {
            common.printAsJson(ast.name, "Identifier");
        } break;
        default:
            throw new Error(`AST node type "${ast.type}" is not expected.`)
            break;
    }
}