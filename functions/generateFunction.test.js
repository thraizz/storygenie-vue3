const { getTipTapDocFromOpenAI } = require("./generateStory");
const { describe, it, expect } = require("@jest/globals");

const productDescription = "This online shop sells custom-made jewelry. It is powered by WooCommerce, which enables customers to easily browse and purchase items. The shop also offers a variety of payment options, including credit cards and PayPal. The administrator can easily manage the shop, adding new products, modifying product descriptions, setting prices, and controlling inventory. Customers can easily create accounts, add items to their cart, and check out. They can also track their orders and receive notifications when their items have shipped. Administrators can also view customer orders, track inventory, and issue refunds.";
const storyDescription = "As a customer, I want to save articles to my wishlist so that I can easily find them later. I want to be able to view my wishlist and add items to my cart. I also want to be able to remove items from my wishlist and cart. As an administrator, I want to be able to view customer wishlists and carts. I want to be able to add items to a customer's cart and wishlist. I also want to be able to remove items from a customer's cart and wishlist.";

describe("getTipTapDocFromOpenAI", () => {
  it("should return a string", async () => {
    const result = await getTipTapDocFromOpenAI(productDescription, storyDescription);
    expect(typeof result).toBe("string");
  });
});
