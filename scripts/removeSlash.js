import fs from 'fs';

const htmlFile = 'dist/index.html';

fs.readFile(htmlFile, 'utf-8', function (err, data) {
    if (err) throw err;

    console.log("Removing slashes from", htmlFile);

    const formattedHtml = data
        .replace(/src="\//, "src=\"")
        .replace(/href="\//g, "href=\"");

    fs.writeFile(htmlFile, formattedHtml, 'utf-8', (err) => {
        if (err) throw err;
    });
});
