import { optiMAL } from "./optiMAL2.mjs";
var glob = optiMAL(window);
glob.runAll(`
(console.log "ハロー©")
[dotimes (i 3) (console.log i]
(define x 11)
(define y 22)
(console.log (+ x y]
[let ((a 33) (b 44)) (console.log (+ a b]
[let* ((a 55) (b (+ 1 a))) (console.log (list a b]
[let* [(a 55) (b (+ 1 a] (console.log (list a b]
`); // glob.runAll(
