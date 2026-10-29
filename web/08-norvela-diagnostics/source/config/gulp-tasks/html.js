import versionNumber from "gulp-version-number";
import webpHtmlNosvg from "gulp-webp-html-nosvg";
import { Transform } from "stream";

// gulp-version-number додає ?_v= і до зовнішніх посилань (Google Fonts).
// Прибираємо версію з усіх https:// посилань, залишаючи її тільки для локальних файлів.
const stripExternalVersions = () => new Transform({
	objectMode: true,
	transform(file, enc, cb) {
		if (file.isBuffer()) {
			const html = file.contents.toString().replace(/(https:\/\/[^"']+?)[?&]_v=\d+/g, '$1');
			file.contents = Buffer.from(html);
		}
		cb(null, file);
	}
});

export const html = () => {
	return app.gulp.src(`${app.path.build.html}*.html`)
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "HTML",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(
			app.plugins.if(
				app.isWebP,
				webpHtmlNosvg()
			)
		)
		.pipe(versionNumber({
			'value': '%DT%',
			'append': {
				'key': '_v',
				'cover': 0,
				'to': ['css', 'js', 'img']
			},
			'output': {
				'file': 'config/version.json'
			}
		}))
		.pipe(stripExternalVersions())
		.pipe(app.gulp.dest(app.path.build.html));
}
