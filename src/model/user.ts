import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      requried: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "users", // 모델명의 복수 형태로 컬렉션 조회함.
  }
);

const user = mongoose.model("User", userSchema); // 모델명 대문자 이름은 js에서 클래스나 생성자 함수의 이름을 대문자로 시작하는 관례

export { user };
