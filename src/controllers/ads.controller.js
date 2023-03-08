const db = require('../models')
const Product = db.product
const Image = db.image
const User = db.user
const Op = db.Sequelize.Op

const fs = require('fs');
const puppeteer = require('puppeteer');
const mustache  = require('mustache');
const path      = require('path');

const __basedir = path.resolve();

exports.random = (req, res) => {
    Product.findAll({
        where: {
            sold: false
        },
        limit: 10,
        order: db.sequelize.literal('rand()'),
        include: Image
    }).then((result) => {
        res.status(200).json({
            data: result,
            message: 'show random product'
        })
    }).catch((err) => {
        res.status(500).json({
            message: err.message
        })
    })
}

exports.detail = (req, res) => {
    id = req.params.id;

    Product.findByPk(id, {
        include: [
            { model: Image, as: 'images' },
            {
                model: User, as: 'user', attributes: {
                    exclude: ['id', 'password', 'createdAt', 'updatedAt']
                }
            },
        ]
    }).then((result) => {
        res.status(200).json({
            data: result,
            message: 'show product'
        })

    }).catch((err) => {
        res.status(500).json({
            message: err.message
        })
    })
}

exports.search = (req, res) => {
    const lat = parseFloat(req.query.lat)
    const lng = parseFloat(req.query.lng)
    const { title } = req.query

    let condition = title ? { title: { [Op.like]: `%${title}%` } } : null

    Product.findAll({
        attributes: {
            include: [
                [
                    db.sequelize.literal(
                        `6371 *
                        acos(cos(radians(${lat})) * cos(radians(loc_latitude))*
                        cos(radians(${lng}) - radians(loc_longitude)) +
                        sin(radians(${lat})) * sin(radians(loc_latitude)))
                        `
                    ),
                    'distance'
                ]
            ]
        },
        where: {
            sold: false,
            ...condition
        },
        having: db.sequelize.where(db.sequelize.col('distance'), '<', 25),
        order: db.sequelize.col('distance'),
        limit: 10,
        include: Image
    }).then((result) => {
        res.status(200).json({
            data: result,
            message: 'show list products'
        })
    }).catch((err) => {
        res.status(500).json({
            message: err.message
        })
    })
}

exports.pdf = async (req, res) => {

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        const htmlBody = fs.readFileSync(__basedir + '/halaman1.ejs', 'utf-8');
        const data = {
            nomor: 112,
            tanggal: "21 September 2020",
            alamat: "Bogor, Jawa barat",
            pembayaran: [
                { metode: "Tunai", jumlah: "Rp2.000.000" }
            ],
            barang: [
                { item: "nVidia GeForce 3090 RTX", harga: "Rp1.000.000" },
                { item: "AMD Ryzen 7", harga: "Rp1.000.000" }
            ],
            total: "Rp2.000.000"
        };
    
        await page.setContent(mustache.render(htmlBody, data));
        const pdf = await page.pdf({ format: 'A4' });
        fs.writeFileSync("./tag.pdf", pdf);
    
        page.close();
        browser.close();

        res.status(200).json({
            message: 'export successfuly!'
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }

}
