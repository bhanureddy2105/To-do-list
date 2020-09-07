require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const {
    urlencoded
} = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your todolist!"
})

const item2 = new Item({
    name: "Hit the + button to add a new item"
})

const item3 = new Item({
    name: "<-- Hit this to delete an item"
})

const defaultItems = [item1, item2, item3];


app.get('/', function (req, res) {
    var date = new Date();
    var options = {
        month: "long",
        weekday: "long",
        day: "numeric"

    }
    var day = date.toLocaleDateString('en-US', options);
    Item.find({}, function (err, foundItems) {

        if (foundItems.length == 0) {
            Item.insertMany(defaultItems, function (err) {
                if (!err) {
                    console.log("success");
                }
            })
            res.redirect("/")
        } else {
            res.render('list', {
                title: day,
                newItems: foundItems
            });
        }
    })
})


app.post("/", function (req, res) {
    var itemName = _.startCase(_.toLower(req.body.tolist));

    const item = new Item({
        name: itemName
    })

    item.save()

    res.redirect("/")

});

app.post('/delete', function (req, res) {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndDelete(checkedItemId, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log('Success');
            res.redirect("/")
        }
    })
})

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
app.listen(port, function () {
    console.log('server setup success');
})