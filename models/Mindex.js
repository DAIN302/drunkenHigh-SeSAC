const Sequelize = require("sequelize"); // sequelize 패키지를 불러옴
<<<<<<< HEAD
const config = require(__dirname + "/../config/config.js")// db 연결 정보
const db = {}; // 빈 객체

=======
const config = require(__dirname + "/../config/config.js")["development"]; // db 연결 정보
const db = {}; // 빈 객체
>>>>>>> c58a600a39f71a9482b760f6b38a00753dfd4c74
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
<<<<<<< HEAD
); // sequelize 객체

// 모델 불러오기
const RecipesModel = require("./Mrecipe")(sequelize, Sequelize);
const Recipe_Img_Model = require("./Mrecipe")(sequelize, Sequelize);

// 모델간 관계 연결
// RECIPES <-> RECIPE_IMG 1:N 관계 연결
RecipesModel.hasMany(Recipe_Img_Model,{
    // recipe_img 테이블에서 'recipe_num' fk 생성
    foreignKey : 'recipe_num',
    // recipe 테이블에서 참조될 키는 'recipe_num' 
    sourceKey: 'recipe_num'
});
Recipe_Img_Model.belongsTo(RecipesModel,{
    // recipe_img 테이블에 'user_id' fk 생성
    foreignKey:'recipe_num',
    // 참조하게 될 recipe 의 키는 'user_id'
    targetKey:'recipe_num'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Recipes = RecipesModel;
db.Recipe_Img = Recipe_Img_Model;

=======


); // sequelize 객체
// 모델 불러오기
const RECIPESMODEL = require("./Mrecipe")(sequelize, Sequelize);
const RECIPE_IMG_MODEL = require("./Mrecipe")(sequelize, Sequelize);
const USERSMODEL = require('./Muser')(sequelize, Sequelize);


// 모델간 관계 연결
// RECIPES <-> RECIPE_IMG 1:N 관계 연결
RECIPESMODEL.hasMany(RECIPE_IMG_MODEL,{
    // recipe_img 테이블에서 'recipe_num' fk 생성
    foreignKey : 'recipe_num',
    // recipe 테이블에서 참조될 키는 'recipe_num'
    sourceKey: 'recipe_num'
});
RECIPE_IMG_MODEL.belongsTo(RECIPESMODEL,{
    // recipe_img 테이블에 'user_id' fk 생성
    foreignKey:'user_id',
    // 참조하게 될 recipe 의 키는 'user_id'
    targetKey:'user_id'
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Recipes = RECIPESMODEL;
db.Users= USERSMODEL;
db.Recipe_Img = RECIPE_IMG_MODEL;
>>>>>>> c58a600a39f71a9482b760f6b38a00753dfd4c74
module.exports = db;