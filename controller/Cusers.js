const { DataTypes, where } = require('sequelize');
const { sequelize } = require('../models/Mindex');
const UsersModel = require('../models/Muser');
const Users = UsersModel(sequelize, DataTypes);
const { hashPw, comparePw } = require('../middleware/encrypt')
const RecipesModel = require('../models/Mrecipe');
const Recipes = RecipesModel(sequelize, DataTypes);
const RecipesImageModel = require('../models/Mrecipe_img');
const RecipesImg = RecipesImageModel(sequelize, DataTypes);
const {Op} = require('sequelize');
const validator = require('validator'); 



exports.getUmain = async (req, res) => {
    try {
        // 세션에 저장된 사용자 정보 가져오기
        const user_id = req.session.user.user_id;
        const user_name = req.session.user.user_name;

        // umain 페이지 렌더링 시 세션에 있는 사용자 정보 전달
        res.render('umain', { user: { user_id, user_name } });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


    //로그인
     exports.getLogin = async (req, res) => {
       res.render('user')

    }

    exports.postLogin = async (req, res) => {
      
        try {
        const {user_id, user_pw} = req.body;

        const user = await Users.findOne({
            where:{
                user_id
            },
            attributes:['user_id','user_name','user_pw']
        });

            if (!user || !(await comparePw(user_pw, user.user_pw))) {
                return res.status(401).json({ success: false, message: '등록되지 않은 사용자입니다.' });

    
         } else {

            req.session.user = {
                user_id: user.user_id,
                user_name: user.user_name
             };
          
             console.log('세션 정보:', req.session.user); // 세션 정보 확인

             
            res.redirect('/users/umain')

         }
       } catch (error) {
         res.status(500).send('Internal Server Error');
       }
    }



    //로그아웃
    exports.postLogout = async (req, res) => {
        try {
            console.log('로그아웃 전 세션 정보:', req.session); // 세션 정보 확인
    
            req.session.destroy(err => {
                if (err) {
                    console.error('세션 삭제 오류:', err);
                    return res.status(500).json({ message: '세션 삭제 실패' });
                }
                res.clearCookie('connect.sid'); // 세션 쿠키 삭제
                console.log('로그아웃 완료');
                res.redirect('/users/login'); // 로그아웃 후 리다이렉트할 페이지 설정
            });
        } catch (error) {
            console.error('로그아웃 오류:', error);
            res.status(500).json({ message: '로그아웃 실패' });
        }
    };
    
        
    



    //회원가입(GET)
    exports.getUsers = async (req, res) => {
         res.render('register')
        // let isLogin = req.session.user
        // if(isLogin) {
        //     res.render('404')
        // } else {
        //     res.render('register', {isLogin})
        // }
       

    }


    //회원가입(POST)
    exports.postUsers = async (req, res) => {
        try {
        
            const {user_id, user_name, user_pw, birth_day, profile_img} = req.body;
           

            // 생년월일 형식 변환
            const year = birth_day.substring(0, 4); // 연도 추출
            const month = birth_day.substring(4, 6); // 월 추출
            const day = birth_day.substring(6, 8); // 일 추출

            const formatBirth = `${year}-${month}-${day}`;


            console.log(formatBirth);


             // 중복된 사용자 아이디 확인
             const userInfo = await Users.findOne({
                where: {
                    user_id: user_id

                }
            });

            if (userInfo) {

                return res.status(400).json({ success: false, message: '중복된 아이디 입니다.' });

            }
             // 유효성 검사
            if (!validator.isLength(user_id, { min: 6, max: 20 }) || !/^[a-z][a-z0-9]*$/g.test(user_id)) {
                return res.status(400).json({ success: false, message: '아이디는 영문 소문자와 숫자로 이루어진 6~20자리여야 합니다.' });
            }

            if (!validator.isLength(user_pw, { min: 8, max: 16 }) || !/(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=])/.test(user_pw)) {
                return res.status(400).json({ success: false, message: '비밀번호는 8~16자의 영문자, 숫자, 특수문자를 포함해야 합니다.' });
            }
          

      
            //회원 생성
            const newUser = await Users.create({
                user_id, user_name, profile_img, user_pw, birth_day: formatBirth
            });
            res.json(newUser);
            } catch (error) {
                console.error(error);
                res.status(500).send('Internal Server Error');
            }
    }

    // exports.chkId = async (req, res) => {
    //     const { user_id } = req.body
    //     const chkId = await Users.findOne({
    //         where : [
    //             user_id 
    //         ]
    //     })
    //     if(chkId){
    //         res.json{success : true}
    //     } else {
    //         res.status(401).json({success : false})
    //     }
    // }
   // 마이페이지 ---- 태완

   // myprofile controller 추가
   exports.getMyprofile = async (req, res) => {
       //if(req.session.loggedin) {
           // // session 으로 user 정보 받아오기
           // const user_id = req.session.user_id;
           const user_id = "user1";
           // user_name, profile_img 찾기
           const userInfo = await Users.findOne({
               where: {
                   user_id
               }
           })
           const user_num = userInfo.user_num;
           const user_name = userInfo.user_name;
           const profile_img = userInfo.profile_img;
           // array type으로 특정 user의 레시피 목록 불러오기
           const recipeList = await Recipes.findAll({
               where: {
                   user_num
               }
           })
           let recipe_list = [];
           let recipeNumList = [];
           recipeList.forEach((recipe) => {
               let recipeInfo = new Object();
               recipeInfo.recipe_num = recipe.recipe_num;
               recipeNumList.push(recipe.recipe_num);
               recipeInfo.recipe_title = recipe.title;
               recipeInfo.main_ing = recipe.main_ingredient;
               recipeInfo.likes_count = recipe.likes_count;
               //recipeInfo.write_data = recipe.created_at --> 확인필요
               recipe_list.push(recipeInfo);
               // console.log("ㅆㄸㄴㅆ >>>>>>>> ", recipe.created_at);
           })
           const recipeImg = await RecipesImg.findAll({
               where: {
                   recipe_num: {
                       [Op.in]: recipeNumList
                   }
               }
           })
           // recipe_list 에 각 레시피의 메인 이미지 경로 추가하기
           recipeImg.forEach((imgPath) => {
               recipe_list.forEach((recipeObj) => {
                   if(imgPath.main_img === 1) {
                       recipeObj.main_img = imgPath.image_url;
                   }
               })
           })
           // // -- test --
           // console.log(recipe_list);
           // // ---------

           res.render('myProfile', {
               user_id,
               user_name,
               profile_img,
               recipe_list
           });
       // } else {
       //     // 로그인 페이지
       //     res.render('');
       // }
   }