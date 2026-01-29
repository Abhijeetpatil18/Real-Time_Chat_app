import { useRef, useState } from "react";
import { Image, Send, X, Smile } from "lucide-react";
import { axiosInstance } from "../lib/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { sendNewMessage } from "../feauters/messageSlice.js";
// import toast from "react-hot-toast";

const ChatInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { selectedUser } = useSelector((state) => state.message);
  const { socket } = useSelector((state) => state.socket);

  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      const res = await axiosInstance.post(`/messages/${selectedUser._id}`, {
        text,
      });
      if (res) {
        // dispatch(sendNewMessage(res.data));

        console.log("Message sent suucessfully");
        const data = {
          senderId: res.data.senderId,
          receiverId: res.data.receiverId,
          text: res.data.text,
        };
        socket.emit("sendMessage", data);
      }

      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setText("");
    }
  };

  return (
    //If image selected
    <div className="p-4 w-full bg-base-100 border-t border-base-300">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center hover:bg-base-200 transition-colors"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            className="w-full px-4 py-2 pr-12 rounded-full border border-base-300 bg-base-100 
                     focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                     placeholder:text-zinc-500 text-sm"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 
                     text-zinc-400 hover:text-zinc-600 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <button
          type="submit"
          className="btn btn-circle btn-primary btn-sm hover:btn-primary-focus transition-colors"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
