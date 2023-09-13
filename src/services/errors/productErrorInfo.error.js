export const generateProductErrorInfo = (product) =>{
    return `
    Some of the fields to create the product are not valid:
    List of required fields:
    title: Must be a string field, but received ${product.title},
    description: Must be a string field, but received ${product.description},
    price: Must be a number field, but received ${product.price},
    thumbnail: Must be a list field, but received ${product.thumbnail},
    code: Must be a string field, but received ${product.code},
    stock: Must be a number field, but received ${product.stock},
    status: Must be a boolean field, but received ${product.status},
    category: Must be a string field, but received ${product.category},
    `
}