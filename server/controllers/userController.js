const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Basket} = require('../models/models')

const generateJwt = (id,email,role) => {
  return jwt.sign({id , email , role}, process.env.SECRET_KEY,
    {expiresIn: '24h'})
}

class UserController{
  async registration(req,res, next){
    const {email, password, role} = req.body
    console.log('user')
    console.log(email, password)
    if(!email || !password){
      next(ApiError.badRequest("Некорректный email или пароль"))
    }
    const candidate = await User.findOne({where: {email}})
    console.log("candidate",candidate)
    if(candidate){
      return next(ApiError.badRequest("Пользователь с таким именем уже существует"))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({email,role, password: hashPassword})
    const bascket = await Basket.create({userId: user.id})
    const token = generateJwt(  user.id,  user.email, user.role)
    return  res.json({token})
  }

  async login(req,res, next){
    const {email, password} = req.body
    const user = await User.findOne({where:{email}})
    if(!user){
      return next(ApiError.internal("Пользователя с таким именем не существует"))
    }
    let comparePassword = bcrypt.compareSync(password,user.password)
    if(!comparePassword){
      return next(ApiError.internal("Пароль не верный"))
    }
    const token = generateJwt(  user.id,  user.email, user.role)
    return  res.json({token})

  }

  async check(req,res, next){
    console.log('req',req)

    const token = generateJwt(  req.user.id,  req.user.email, req.user.role)
    return  res.json({token})

       res.json({message:'all right'})
  }

}

module.exports = new UserController()