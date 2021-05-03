import Joi from 'joi'

const validar = producto => {
    const productoSchema = Joi.object({
        nombre: Joi.string().alphanum().required(),
        precio:Joi.number().required(),
        descripcion:Joi.string().required(),
        url:Joi.string().required()
    })

    const {error} = productoSchema.validate(producto)
    if(error) {
        return { result: false, error}
    }
    else {
        return { result: true}
    }
}

export default validar