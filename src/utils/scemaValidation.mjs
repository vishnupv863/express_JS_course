export const bodyValidator = {
    name:{
        isLength:{
            options:{
                min:5,
                max:10
            },
            errorMessage:"name must be between 5 to 10 charecters"
        },
        isString:{
            errorMessage:"name must be a string"
        }, 
        notEmpty:{
            errorMessage:"the name cannot be empty"
        }
    },
    displayname:{
        notEmpty:{
            errorMessage:"the displayname cannot be empty"
        }
    }
};