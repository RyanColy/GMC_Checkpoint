require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

describe("Cloudinary connection", () => {
  it("can reach Cloudinary API and upload a test image", async () => {
    // Upload a 1x1 transparent PNG encoded as base64
    const result = await cloudinary.uploader.upload(
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      { folder: "nextalk/test", public_id: "connection-test", overwrite: true }
    );

    expect(result.secure_url).toMatch(/^https:\/\/res\.cloudinary\.com/);
    expect(result.public_id).toBe("nextalk/test/connection-test");

    // Clean up the test file
    await cloudinary.uploader.destroy("nextalk/test/connection-test");
  }, 15000);
});
