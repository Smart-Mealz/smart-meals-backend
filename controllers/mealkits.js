import { MealkitModel } from "../models/mealkit.js";
import { UserModel } from "../models/user.js";
import {
  addMealkitValidator,
  updateMealkitImageValidator,
  updateMealkitValidator,
} from "../validators/mealkits.js";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.js";

//Add a mealkit controller
export const addMealkit = async (req, res) => {
  // Validate user input
  const { error, value } = addMealkitValidator.validate({
    ...req.body,
    image: req.file.filename,
  });
  if (error) {
    return res.status(422).json(error);
  }
  //Save product information in database
  const user = await MealkitModel.create({ ...value, userId: req.auth.id });

  res.status(201).json({ message: "Mealkit added successfully.", data: user });
};

//Get all mealkits controller
// export const getAllMealkits = async (req, res) => {
//   // Destructure and set default values
//   const {
//     minPrice,
//     maxPrice,
//     sort,
//     order,
//     page = 1,
//     limit = 10,
//     category,
//   } = req.query;

//   const queryObject = {};

//   // Price filter by lowest to highest http://localhost:5000/api/products?minPrice=100&maxPrice=1000
//   if (minPrice && maxPrice) {
//     queryObject.price = {
//       $gte: parseFloat(minPrice),
//       $lte: parseFloat(maxPrice),
//     };
//   }

//   // Category filter by Continental http://localhost:3000/api/v1/mealkits?category=Continental
//   // Category filter by Local http://localhost:3000/api/v1/mealkits?category=Local
//   if (category) {
//     queryObject.category = category;
//   }

//   // Sorting
//   //Sort by Price High to Low: http://localhost:5000/api/products?sort=price&order=desc
//   //Sort by Price Low to High: http://localhost:5000/api/products?sort=price&order=asc
//   //Sort by Alphabetical(A-Z): http://localhost:5000/api/products?sort=name&order=asc
//   //Sort by Alphabetical(Z-A): http://localhost:5000/api/products?sort=name&order=desc
//   let sortObj = {};
//   if (sort) {
//     const sortOrder = order === "desc" ? -1 : 1;
//     sortObj[sort] = sortOrder;
//   }

//   // Pagination setup (optional)
//   // http://localhost:5000/api/products?page=2&limit=5

//   const skip = (parseInt(page) - 1) * parseInt(limit);

//   // Execute query
//   const mealkits = await MealkitModel.find(queryObject)
//     .sort(sortObj)
//     .skip(skip)
//     .limit(parseInt(limit));

//   res.status(200).json({ mealkits });
// };

// export const getAllMealkits = async (req, res) => {
//   try {
//     const {
//       minPrice,
//       maxPrice,
//       sort,
//       order,
//       page = 1,
//       limit = 3,
//       category,
//     } = req.query;

//     const parsedPage = parseInt(page);
//     const parsedLimit = parseInt(limit);
//     const skip = (parsedPage - 1) * parsedLimit;

//     const queryObject = {};

//     if (minPrice && maxPrice) {
//       queryObject.price = {
//         $gte: parseFloat(minPrice),
//         $lte: parseFloat(maxPrice),
//       };
//     }

//     if (category) {
//       queryObject.category = category;
//     }

//     const totalMealkits = await MealkitModel.countDocuments(queryObject);
//     const totalPages = Math.ceil(totalMealkits / parsedLimit);
//     const startIndex = skip + 1;
//     const endIndex = Math.min(skip + parsedLimit, totalMealkits);

//     const mealkits = await MealkitModel.find(queryObject)
//       .sort(sort ? { [sort]: order === "desc" ? -1 : 1 } : {})
//       .skip(skip)
//       .limit(parsedLimit);

//     const pagination = {
//       currentPage: parsedPage,
//       totalPages,
//       totalMealkits,
//       startIndex,
//       endIndex,
//       summaryText: `Showing ${startIndex}–${endIndex} of ${totalMealkits} results`,
//       pages: Array.from({ length: totalPages }, (_, i) => i + 1),
//       hasPrevPage: parsedPage > 1,
//       hasNextPage: parsedPage < totalPages,
//       prevPage: parsedPage > 1 ? parsedPage - 1 : null,
//       nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
//     };

//     res
//       .status(200)
//       .json({ pagination, message: "Mealkits fetched successfully", mealkits });
//   } catch (error) {
//     console.error("Error fetching mealkits:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };
// export const getAllMealkits = async (req, res) => {
//   try {
//     const {
//       minPrice,
//       maxPrice,
//       sort,
//       order,
//       page = 1,
//       limit = 3,
//       category,
//     } = req.query;

//     const parsedPage = parseInt(page);
//     const parsedLimit = parseInt(limit);
//     const skip = (parsedPage - 1) * parsedLimit;

//     const queryObject = {};

//     if (minPrice && maxPrice) {
//       queryObject.price = {
//         $gte: parseFloat(minPrice),
//         $lte: parseFloat(maxPrice),
//       };
//     }

//     if (category) {
//       queryObject.category = new RegExp(category, "i");
//     }

//     const totalMealkits = await MealkitModel.countDocuments(queryObject);
//     const totalPages = Math.ceil(totalMealkits / parsedLimit);
//     const startIndex = skip + 1;
//     const endIndex = Math.min(skip + parsedLimit, totalMealkits);

//     const mealkits = await MealkitModel.find(queryObject)
//       .sort(sort ? { [sort]: order === "desc" ? -1 : 1 } : {})
//       .skip(skip)
//       .limit(parsedLimit);

//     // Build base URL
//     const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
//       req.path
//     }`;
//     const queryParams = new URLSearchParams({ ...req.query });

//     const getPageLink = (pageNum) => {
//       queryParams.set("page", pageNum);
//       return `${baseUrl}?${queryParams.toString()}`;
//     };

//     const pagination = {
//       currentPage: parsedPage,
//       totalPages,
//       totalMealkits,
//       startIndex,
//       endIndex,
//       summaryText: `Showing ${startIndex}–${endIndex} of ${totalMealkits} results`,
//       pages: Array.from({ length: totalPages }, (_, i) => i + 1),
//       hasPrevPage: parsedPage > 1 ? getPageLink(parsedPage - 1) : null,
//       hasNextPage: parsedPage < totalPages ? getPageLink(parsedPage + 1) : null,
//       prevPage: parsedPage > 1 ? parsedPage - 1 : null,
//       nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
//     };

//     res
//       .status(200)
//       .json({ pagination, message: "Mealkits fetched successfully", mealkits });
//   } catch (error) {
//     console.error("Error fetching mealkits:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };
// export const getAllMealkits = async (req, res) => {
//   try {
//     const {
//       minPrice,
//       maxPrice,
//       sort,
//       order,
//       page = 1,
//       limit = 3,
//       category,
//     } = req.query;

//     const parsedPage = parseInt(page);
//     const parsedLimit = parseInt(limit);
//     const skip = (parsedPage - 1) * parsedLimit;

//     const queryObject = {};

//     // Enforce both minPrice and maxPrice to be required
//     if (minPrice && maxPrice) {
//       queryObject.price = {
//         $gte: parseFloat(minPrice),
//         $lte: parseFloat(maxPrice),
//       };
//     } else if (minPrice) {
//       queryObject.price = {
//         $gte: parseFloat(minPrice),
//       };
//     } else if (maxPrice) {
//       queryObject.price = {
//         $lte: parseFloat(maxPrice),
//       };
//     }

//     // Optional category filter
//     if (category) {
//       queryObject.category = new RegExp(category, "i"); // Case insensitive category search
//     }

//     const totalMealkits = await MealkitModel.countDocuments(queryObject);
//     const totalPages = Math.ceil(totalMealkits / parsedLimit);
//     const startIndex = skip + 1;
//     const endIndex = Math.min(skip + parsedLimit, totalMealkits);

//     const mealkits = await MealkitModel.find(queryObject)
//       .sort(sort ? { [sort]: order === "desc" ? -1 : 1 } : {})
//       .skip(skip)
//       .limit(parsedLimit);

//     // Build base URL for pagination links
//     const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
//       req.path
//     }`;
//     const queryParams = new URLSearchParams({ ...req.query });

//     const getPageLink = (pageNum) => {
//       queryParams.set("page", pageNum);
//       return `${baseUrl}?${queryParams.toString()}`;
//     };

//     const pagination = {
//       currentPage: parsedPage,
//       totalPages,
//       totalMealkits,
//       startIndex,
//       endIndex,
//       summaryText: `Showing ${startIndex}–${endIndex} of ${totalMealkits} results`,
//       pages: Array.from({ length: totalPages }, (_, i) => i + 1),
//       hasPrevPage: parsedPage > 1 ? getPageLink(parsedPage - 1) : null,
//       hasNextPage: parsedPage < totalPages ? getPageLink(parsedPage + 1) : null,
//       prevPage: parsedPage > 1 ? parsedPage - 1 : null,
//       nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
//     };

//     res
//       .status(200)
//       .json({ pagination, message: "Mealkits fetched successfully", mealkits });
//   } catch (error) {
//     console.error("Error fetching mealkits:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };
// export const getAllMealkits = async (req, res) => {
//   try {
//     const {
//       minPrice,
//       maxPrice,
//       sort,
//       order,
//       page = 1,
//       limit = 3,
//       category,
//     } = req.query;

//     const parsedPage = parseInt(page);
//     const parsedLimit = parseInt(limit);
//     const skip = (parsedPage - 1) * parsedLimit;

//     const queryObject = {};

//     // Handling price range filters
//     if (minPrice && maxPrice) {
//       queryObject.price = {
//         $gte: parseFloat(minPrice),
//         $lte: parseFloat(maxPrice),
//       };
//     } else if (minPrice) {
//       queryObject.price = {
//         $gte: parseFloat(minPrice),
//       };
//     } else if (maxPrice) {
//       queryObject.price = {
//         $lte: parseFloat(maxPrice),
//       };
//     }

//     // Category filter with case insensitive search
//     if (category) {
//       queryObject.category = new RegExp(category, "i"); // Case insensitive category search
//     }

//     const totalMealkits = await MealkitModel.countDocuments(queryObject);
//     const totalPages = Math.ceil(totalMealkits / parsedLimit);
//     const startIndex = skip + 1;
//     const endIndex = Math.min(skip + parsedLimit, totalMealkits);

//     // Sorting Logic
//     let sortObject = {};
//     if (sort) {
//       if (sort === "price-ascending") {
//         sortObject.price = 1; // Sort by price low to high
//       } else if (sort === "price-descending") {
//         sortObject.price = -1; // Sort by price high to low
//       } else if (sort === "title-ascending") {
//         sortObject.title = 1; // Sort by title A-Z
//       } else if (sort === "title-descending") {
//         sortObject.title = -1; // Sort by title Z-A
//       }
//     }

//     // Query for mealkits with sorting and pagination
//     const mealkits = await MealkitModel.find(queryObject)
//       .sort(sortObject)
//       .skip(skip)
//       .limit(parsedLimit);

//     // Build base URL for pagination links
//     const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
//       req.path
//     }`;
//     const queryParams = new URLSearchParams({ ...req.query });

//     const getPageLink = (pageNum) => {
//       queryParams.set("page", pageNum);
//       return `${baseUrl}?${queryParams.toString()}`;
//     };

//     const pagination = {
//       currentPage: parsedPage,
//       totalPages,
//       totalMealkits,
//       startIndex,
//       endIndex,
//       summaryText: `Showing ${startIndex}–${endIndex} of ${totalMealkits} results`,
//       pages: Array.from({ length: totalPages }, (_, i) => i + 1),
//       hasPrevPage: parsedPage > 1 ? getPageLink(parsedPage - 1) : null,
//       hasNextPage: parsedPage < totalPages ? getPageLink(parsedPage + 1) : null,
//       prevPage: parsedPage > 1 ? parsedPage - 1 : null,
//       nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
//     };

//     res
//       .status(200)
//       .json({ pagination, message: "Mealkits fetched successfully", mealkits });
//   } catch (error) {
//     console.error("Error fetching mealkits:", error);
//     res.status(500).json({ message: "Something went wrong" });
//   }
// };
export const getAllMealkits = async (req, res) => {
  try {
    const {
      minPrice,
      maxPrice,
      sort,
      order,
      page = 1,
      limit = 3,
      category,
      search,
    } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const queryObject = {};

    // Handling price range filters
    if (minPrice && maxPrice) {
      queryObject.price = {
        $gte: parseFloat(minPrice),
        $lte: parseFloat(maxPrice),
      };
    } else if (minPrice) {
      queryObject.price = {
        $gte: parseFloat(minPrice),
      };
    } else if (maxPrice) {
      queryObject.price = {
        $lte: parseFloat(maxPrice),
      };
    }

    // Search filter (case-insensitive search for title and category)
    if (search) {
      queryObject.$or = [
        { title: new RegExp(search, "i") }, // Case insensitive search for title
        { category: new RegExp(search, "i") }, // Case insensitive search for category
      ];
    }

    // Category filter with case insensitive search
    if (category) {
      queryObject.category = new RegExp(category, "i"); // Case insensitive category search
    }

    const totalMealkits = await MealkitModel.countDocuments(queryObject);
    const totalPages = Math.ceil(totalMealkits / parsedLimit);
    const startIndex = skip + 1;
    const endIndex = Math.min(skip + parsedLimit, totalMealkits);

    // Sorting Logic
    let sortObject = {};
    if (sort) {
      if (sort === "price-ascending") {
        sortObject.price = 1; // Sort by price low to high
      } else if (sort === "price-descending") {
        sortObject.price = -1; // Sort by price high to low
      } else if (sort === "title-ascending") {
        sortObject.title = 1; // Sort by title A-Z
      } else if (sort === "title-descending") {
        sortObject.title = -1; // Sort by title Z-A
      }
    }

    // Query for mealkits with sorting and pagination
    const mealkits = await MealkitModel.find(queryObject)
      .sort(sortObject)
      .skip(skip)
      .limit(parsedLimit);

    // Build base URL for pagination links
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
      req.path
    }`;
    const queryParams = new URLSearchParams({ ...req.query });

    const getPageLink = (pageNum) => {
      queryParams.set("page", pageNum);
      return `${baseUrl}?${queryParams.toString()}`;
    };

    const pagination = {
      currentPage: parsedPage,
      totalPages,
      totalMealkits,
      startIndex,
      endIndex,
      summaryText: `Showing ${startIndex}–${endIndex} of ${totalMealkits} results`,
      pages: Array.from({ length: totalPages }, (_, i) => i + 1),
      hasPrevPage: parsedPage > 1 ? getPageLink(parsedPage - 1) : null,
      hasNextPage: parsedPage < totalPages ? getPageLink(parsedPage + 1) : null,
      prevPage: parsedPage > 1 ? parsedPage - 1 : null,
      nextPage: parsedPage < totalPages ? parsedPage + 1 : null,
    };

    res
      .status(200)
      .json({ pagination, message: "Mealkits fetched successfully", mealkits });
  } catch (error) {
    console.error("Error fetching mealkits:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

//Get a mealkit controller
export const getMealkit = async (req, res) => {
  const mealkit = await MealkitModel.findById(req.params.id);

  if (!mealkit) {
    return res.status(404).json({ message: "Mealkit not found" });
  }

  return res
    .status(200)
    .json({ message: "Mealkit fetched successfully.", data: mealkit });
};

//Update a mealkit
export const updateMealkit = async (req, res) => {
  const { error, value } = updateMealkitValidator.validate(req.body);
  if (error) {
    return res.status(422).json(error);
  }
  const updatedMealkit = await MealkitModel.findOneAndUpdate(
    { _id: req.params.id },
    value,
    { new: true }
  );

  if (!updatedMealkit) {
    return res.status(404).json({
      message: "Mealkit not found.",
    });
  }
  res.status(200).json({
    message: "Mealkit updated successfully",
    mealkit: updatedMealkit,
  });
};

//Update a mealkit image
export const updateMealkitImage = async (req, res) => {
  const { error, value } = updateMealkitImageValidator.validate({
    image: req.file.filename,
  });
  if (error) {
    return res.status(422).json(error);
  }

  const updatedMealkitImage = await MealkitModel.findOneAndUpdate(
    { _id: req.params.id },
    value,
    { new: true }
  );

  if (!updatedMealkitImage) {
    return res.status(404).json({
      message: "Mealkit image not found.",
    });
  }
  res.status(200).json({
    message: "Mealkit image updated successfully",
    mealkit: updatedMealkitImage,
  });
};

//Delete a mealkit controller
export const deleteMealkit = async (req, res) => {
  const advert = await MealkitModel.findOneAndDelete(req.params.id);

  if (!advert) {
    return res.status(404).json({
      message: "Mealkit not found.",
    });
  }

  res.status(200).json({ message: "Mealkit deleted successfully" });
};
