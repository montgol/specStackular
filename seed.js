var mongoose = require('mongoose');
var dbConnection = require('./server/db');

var dataItem = [
    {   name: 'Sullivan', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-sullivan-eyeglasses-saltwater-matte-front-1798-a613bd26/1000x500', categories: ['men', 'Saltwater']},
    {   name: 'Sullivan', price: 145, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-sullivan-eyeglasses-woodgrain-tortoise-front-1805-d5bbc7a8/1000x500', categories: ['men', 'Woodgrain']},
    {   name: 'Winston', price: 120, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-winston-eyeglasses-cognac-tortoise-citron-front-2066-a7fa3e61/1000x500', categories: ['men', 'Cognac Tortoise']},
    {   name: 'Winston', price: 120, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/ed814ccac5a6fa5e1714ced174950dac916328e1/1000x500', categories: ['men', 'Lunar Fade']},
    {   name: 'Winston', price: 120, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/3f7a8e6c7310ec2859710f970b38e2be8b8d8afa/1000x500', categories: ['men', 'Old Fashion Fade']},
    {   name: 'Winston', price: 120, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-winston-eyeglasses-cognac-tortoise-citron-front-2066-a7fa3e61/1000x500', categories: ['men', 'Jet Black']},
    {   name: 'Arthur', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/a915daa9adb960ee992e84fa17064cc44d53de2d/1000x500', categories: ['men', 'Green Spruce']},
    {   name: 'Arthur', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-arthur-eyeglasses-revolver-black-front-1787-bff28fcd/1000x500', categories: ['men', 'Jet Black']},
    {   name: 'Arthur', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/c6b210af8f492d725525eb459e3946c9a612813e/1000x500', categories: ['men', 'Sugar Maple']},
    {   name: 'Arthur', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/c93cc7b77d0c9fef5ddef6092c1bdc8d9fc5cf7f/1000x500', categories: ['men', 'Gimlet Tortoise']},
    {   name: 'Nedwin', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-nedwin-eyeglasses-blue-sapphire-front-1873-d1ae30d6/1000x500', categories: ['men', 'Blue Sapphire']},
    {   name: 'Nedwin', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-nedwin-eyeglasses-jet-black-crystal-front-102-0c1b5738/1000x500', categories: ['men', 'Blue Sapphire']},
    {   name: 'Nedwin', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-nedwin-eyeglasses-blue-sapphire-front-1873-d1ae30d6/1000x500', categories: ['men', 'Jet Black']},
    {   name: 'Nedwin', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-nedwin-eyeglasses-cedar-tortoise-front-456-cb6f9d3c/1000x500', categories: ['men', 'Cedar Tortoise']},
    {   name: 'Nedwin', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-nedwin-eyeglasses-summer-green-front-975-25b96e24/1000x500', categories: ['men', 'Summer Green']},
    {   name: 'Archie', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-archie-eyeglasses-citron-front-1777-7243ebb7/1000x500', categories: ['men', 'Citron']},
    {   name: 'Archie', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/men-archie-eyeglasses-whiskey-tortoise-front-1775-278b0fa7/1000x500', categories: ['men', 'Whiskey']},
    {   name: 'Beckett', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/d16173314c2f46318c53ef45ef243acf0959a1fc/1000x500', categories: ['men', 'Jet Black Matte']},
    {   name: 'Beckett', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/16452cd13d9c624308084aaa65c3afaa03902fbd/1000x500', categories: ['men', 'Striped Evergreen']},   
    {   name: 'Beckett', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/9fe9c7c152aca37ab9163c1bd4a7fe832a12c7fe/1000x500', categories: ['men', 'Striped Chestnut']},
    {   name: 'Daisy', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-daisy-eyeglasses-peacock-tortoise-front-1789-a229271e/1000x500', categories: ['women', 'Peacock Tortoise']},
    {   name: 'Daisy', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-daisy-eyeglasses-striped-molasses-front-1788-cdc2de29/1000x500', categories: ['women', 'Striped Molasses']},
    {   name: 'Coley', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-coley-eyeglasses-crystal-front-1262-8ca4331f/1000x500', categories: ['women', 'Crystal']},
    {   name: 'Coley', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-coley-eyeglasses-woodgrain-tortoise-front-1264-5f2bb967/1000x500', categories: ['women', 'Woodgrain']},
    {   name: 'Annette', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-annette-eyeglasses-petal-tortoise-front-1266-3b22329e/1000x500', categories: ['women', 'Petal Tortoise']},
    {   name: 'Annette', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-annette-eyeglasses-striped-sassafras-front-1255-489ff2e7/1000x500', categories: ['women', 'Strip']},
    {   name: 'Sibley', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-sibley-eyeglasses-whiskey-tortoise-matte-front-657-f66a8434/1000x500', categories: ['women', 'Whiskey']},
    {   name: 'Sibley', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-sibley-eyeglasses-catalina-blue-front-505-8a2ac8a9/1000x500', categories: ['women', 'Catalina Blue']},
    {   name: 'Sibley', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-sibley-eyeglasses-revolver-black-front-111-4a1f1852/1000x500', categories: ['women', 'Jet Black']},
    {   name: 'Sibley', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/-/f/women-sibley-eyeglasses-amber-front-213-fcc3fbdf/1000x500', categories: ['women', 'Amber']},
    {   name: 'Raleigh', price: 145, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/0d4cc0ddb7f71c5b7910df19edeb9f816cb1aa47/1000x500', categories: ['women', 'Jet Silver']},
    {   name: 'Raleigh', price: 145, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/0d4cc0ddb7f71c5b7910df19edeb9f816cb1aa47/1000x500', categories: ['women', 'Brushed Bark']},
    {   name: 'Sloan', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/9448c893c19674d4823350a996331975dcb87520/1000x500', categories: ['women', 'Rum Cherry']},
    {   name: 'Sloan', price: 95, availability: true, imgUrl: 'https://i.warbyparker.com/d/f/dc79fdc106ea5535aa10fe0342d4fd1d03b7424a/1000x500', categories: ['women', 'Striped Chestnut']}
];

var dataUser = [
    { first_name: 'Harry', last_name:'Potter', email:'harry.potter@yahoo.com'},
    { first_name: 'Princess', last_name: 'Money', email:'p.money@money.com'},
    { first_name: 'Wizard', middle_name: 'of', last_name: 'Oz', email: 'oz@emeralcity.com', admin: true}
    ];

console.log('welcome to the Seed...');

function addToDb (){

    var Item =  mongoose.model('Item');

	for(var a=0, len = dataItem.length; a<len; a++){
    		console.log(dataItem[a]);
    		Item.create(dataItem[a], function(err, data){
    			if (err) throw err;
    		});
    }
    console.log('Finished adding Items');

    var User = mongoose.model('User');
	for(var a=0, len = dataUser.length; a<len; a++){
		console.log(dataUser[a]);
		User.create(dataUser[a], function(err, data){
			if(err) throw err;
		});
	}

    console.log('Finished adding Users');
    return;
};

    addToDb();



    // {   name: 'cat_eye_glasses', price: 240, availability: true, imgUrl: 'http://1.bp.blogspot.com/-yzWCX3pFeLk/UA_nuIFNCkI/AAAAAAAAALc/uCM-3SnW198/s1600/pierson_blue.jpg', categories: ['womens', 'expensive', 'fashion']},
    // {   name: 'spotted_horn', price: 85, availability: true, imgUrl: 'http://ts4.mm.bing.net/th?id=HN.608002610364091281&pid=1.7', categories:['womens', 'fashion']},
    // {   name: 'whimsy_glasses', price: 110, availability: true, imgUrl: 'http://www.viziooptic.com/images/viziooptic/Product/medium/Wissing-2653-c.-2519-2550-Eyeglasses_20055.jpg', categories:['mens', 'round', 'square']},
    // {   name: 'double_function', price: 140, availability: true, imgUrl: 'http://loft965.files.wordpress.com/2008/10/4-occhi-aspesi-eyeglasses-01.jpg', categories:['mens', 'sunglasses']},
    // {   name: 'pixel_glasses', price: 60, availability: true, imgUrl: 'http://lostinasupermarket.com/wp-content/uploads/2010/05/sd2.jpg', categories:['kids']},
    // {   name: 'guitar_glasses', price: 140, availability: true, imgUrl: 'http://media-cache-ak0.pinimg.com/736x/96/ab/52/96ab52d2aab667bfe17277b1848333bc.jpg', categories:['mens', 'kids']},
    // {   name: 'jeweled_glasses', price: 120, availability: true, imgUrl: 'http://site.wholesalecelebshades.com/blog/wp-content/uploads/2012/08/fete-jeweled-cat-eye-glasses-539g.gif?w=300', categories:['womens', 'fashion']},
    // {   name: 'harvest_glasses', price: 140, availability: true, imgUrl: 'http://cdnb.lystit.com/photos/e7d4-2014/06/26/karen-walker-black-special-fit-harvest-sunglasses-crazy-tortsmoke-mono-product-1-21194792-3-442554778-normal_large_flex.jpeg', categories:['mens', 'sunglasses']},
    // {   name: 'margarita_glasses', price: 120, availability: true, imgUrl: 'http://media-cache-ak0.pinimg.com/736x/67/0d/82/670d82445c65765add7a8262bb14530e.jpg', categories:['womens', 'fashion']},
    // {   name: 'leopard_glasses', price: 220, availability: true, imgUrl: 'http://www.polyvore.com/cgi/img-thing?.out=jpg&size=l&tid=65658529', categories:['womens', 'fashion', 'sunglasses']},
    // {   name: 'louis_vuitton', price: 595, availability: true, imgUrl: 'https://aesthetenews.files.wordpress.com/2012/10/z0506u_pm2_front-view.png', categories:['mens', 'expensive', 'fashion']},
    // {   name: 'drink_glasses', price: 40, availability: true, imgUrl: 'http://seeinteriors.co.uk/images/DS0152_1.jpg', categories:['mens', 'kids']},
    // {   name: 'lego_glasses', price: 60, availability: true, imgUrl: 'http://www.blogcdn.com/www.urlesque.com/media/2010/07/livinleg.jpg', categories:['kids', 'sunglasses']},
    // {   name: 'mask_galsses', price: 70, availability: true, imgUrl: 'http://i01.i.aliimg.com/wsphoto/v0/833459055_1/Wholesale-Summer-Fashion-Cheap-Kids-glasses-children-s-Sunglasses-Eyewear-Mask-Glasses-For-Children-Birthday-party.jpg', categories:['kids', 'sunglasses']},
    // {   name: 'studded_glasses', price: 210, availability: true, imgUrl: 'http://www.nitrolicious.com/blog/wp-content/uploads/2009/03/sonia-rykiel-pearl-sunglasses-01.jpg', categories:['womens', 'fashion', 'sunglasses']},
    // {   name: 'cat_eye_2_glasses', price: 160, availability: true, imgUrl: 'http://media-cache-ec0.pinimg.com/736x/91/ca/db/91cadbef6414f36785dde49a38d4804a.jpg', categories:['womens', 'sunglasses', 'fashion']},
    // {   name: 'retro_glasses', price: 140, availability: true, imgUrl: 'https://s2.yimg.com/sk/3571/3669409415_376c207bef_z.jpg', categories:['womens', 'fashion']},
    // {   name: 'white_cat_glasses', price: 110, availability: true, imgUrl: 'http://www.halloweencostumehideout.com/blog/wp-content/uploads/2012/08/50s-Cat-eye-Glasses.jpg', categories:['womens', 'fashion']},
    // {   name: 'skull_glasses', price: 120, availability: true, imgUrl: 'http://images2.solidcommerce.com/FashionUpscale/EHO705-CO.jpg', categories:['mens', 'fashion']},
    // {   name: 'angry_bird_glasses', price: 80, availability: true, imgUrl: 'http://juicyorange714.com/juicyorange/glasses7/222pinl-bk-fv.jpg', categories:['kids', 'sunglasses']},
    // {   name: 'mardi_gras_glasses', price: 50, availability: true, imgUrl: 'http://s3.amazonaws.com/churchplantmedia-cms/zionchurchofkurten/glasses.jpg', categories:['womens', 'sunglasses']},
    // {   name: 'fashion_glasses', price: 90, availability: true, imgUrl: 'https://s-media-cache-ak0.pinimg.com/236x/84/02/94/84029474af5119b67669f6c2c8f80433.jpg', categories:['womens', 'sunglasses', 'fashion']},
    // {   name: 'smile_face_glasses', price: 170, availability: true, imgUrl: 'http://img.xcitefun.net/users/2012/02/286805,xcitefun-crazy-sunglasses-for-xcitefun-s-friends-.jpg', categories:['mens', 'womens', 'fashion']},
    // {   name: 'white_glasses', price: 140, availability: true, imgUrl: 'http://www.wwwebfun.com/wp-content/uploads/2013/07/Creative-And-Crazy-Sunglasses17.jpg', categories:['mens', 'fashion']},
    // {   name: 'roboto_glasses', price: 210, availability: true, imgUrl: 'http://www.crazyforcostumes.com/ProdImages/roboto-chrome-robot-futuristic-eyeglasses76204.jpg', categories:['mens', 'fashion', 'sunglasses']},
    // {   name: 'finger_glasses', price: 230, availability: true, imgUrl: 'http://www.whoknowsfashion.com/wp-content/uploads/2012/11/Linda-Farrow-by-Jeremy-Scott.png', categories:['womens', 'fashion']},
    // {   name: 'eyeball_glasses', price: 40, availability: true, imgUrl: 'https://s-media-cache-ak0.pinimg.com/236x/e1/33/67/e13367a0d40ba2c4180d1df7eecb3fc3.jpg', categories:['kids']},
    // {   name: 'pink_glasses', price: 50, availability: true, imgUrl: 'http://i00.i.aliimg.com/wsphoto/v0/1871140662_1/New-2014-fashion-summer-font-b-funny-b-font-women-sunglasses-coating-sun-dark-font-b.jpg', categories:['kids']},
    // {   name: 'spy_glasses', price: 90, availability: true, imgUrl: 'http://p.vitalmtb.com/photos/products/3641/photos/2579/s780_spy_blok_sungls_whtcrzyprnt_gry_11.jpg?1322090299', categories:['mens']},
    // {   name: 'star_wars_glasses', price: 45, availability: true, imgUrl: 'http://dqqzjdqmiszdy.cloudfront.net/sites/default/files/content_designer_images/StarWars_2.jpg', categories:['kids', 'mens']},
    // {   name: 'star_trek_glasses', price: 90, availability: true, imgUrl: 'http://www.vanguardproductsgroup.com/images/wordpress/uploads/2012/03/Glasses-with-concept-2-Sensor.jpg', categories:['mens', 'sunglasses']},
    // {   name: 'electric_glasses', price: 130, availability: true, imgUrl: 'http://7fe5adea5c04a064d14a-aa57143e2ca30795bf94ff3884a3b19b.r99.cf1.rackcdn.com/public/images/designer_eyeglasses/Electric/EV02400600_BSG5_matrix%20black.jpg', categories:['mens']}''
    // {   name: 'glow_glasses', price: 60, availability: true, imgUrl: 'http://cdn.shopify.com/s/files/1/0109/4872/products/rainbowzGLOW_IN_DARK_GREENside_1024x1024.jpeg?v=1411002667', categories:['kids']},
    // {   name: 'lazy_guy', price: 80, availability: true, imgUrl: 'http://widgetlove.com/media/catalog/product/cache/1/image/32c3d0b93e1123322b0ba6dc090e7386/s/k/sku_h702101_3_1.jpg', categories:['mens', 'fashion']},
    // {   name: 'wise_glasses', price: 30, availability: true, imgUrl: 'https://nodogaboutit.files.wordpress.com/2012/09/j0407016.jpg', categories:['pet']},
    // {   name: 'lab_glasses', price: 40, availability: true, imgUrl: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQKIprFs-gf19cLJgG-OvM5ZvjtoOXuBV-g40XEDkntKgFzij3M', categories:['pet']},
    // {   name: 'cat_glasses', price: 25, availability: true, imgUrl: 'http://data.whicdn.com/images/14038722/Favim.com-703_large.jpg', categories:['pet']},
    // {   name: 'doggles_glasses', price: 35, availability: true, imgUrl: 'http://www.doggie-diva.com/assets/images/doggles_dog_glasses.jpg', categories:['pet']},
    // {   name: 'geek_glasses', price: 25, availability: true, imgUrl: 'https://s-media-cache-ak0.pinimg.com/236x/33/de/85/33de85a6113c0506754a99c68fa3bea9.jpg', categories:['pet']}
    // ];
