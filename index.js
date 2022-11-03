const axios = require('axios');
const cheerio = require('cheerio');
const Markdown = require('turndown');
const removeMd = require('remove-markdown');


async function parser() {
    const response = await axios('https://polkafantasy.medium.com/aim%C3%A9e-auction-tutorial-97a1a4dd5fa8');
    const $ = cheerio.load(response.data);
    let title = $('.pw-post-title').text();
    let author = $('.gi > div:nth-child(1) > div:nth-child(1) > a').text();
    let image = [];
    let img = $('picture > source').each((i, el) => {
        image.push(($(el).attr('srcset')).split(' ')[0]);
    });

    $('*').each((idx, el) => {
        let attr = Object.keys($(el).get(0).attribs).map((key) => {
            if (key != 'srcSet' && key != 'href' && key != 'src') {
                $(el).removeAttr(key);
            }
        });
    });
    $('*').find('picture').each((i, el) => {
        $(el).replaceWith(`<img> ${image[i]} </ img>`);
    });
    const article = [];
    let html = $('section').html();
    let turndown = new Markdown()
    let markdown = turndown.turndown(html);
    let description = removeMd(markdown);

    article.push({
        title: title,
        author: author,
        image: image,
        html: html,
        markdown: markdown,
        description: description
    });
    console.log(article)
}
parser()