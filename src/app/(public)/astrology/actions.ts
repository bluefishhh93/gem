'use server';

import { unauthenticatedAction } from "@/lib/safe-action";
import { getProductsUseCase } from "@/use-cases/products";
import openai from "@/lib/openai";
import { z } from "zod";

// Define types for the API response
interface AstrologyPrediction {
  health: string;
  family: string;
  love: string;
  career: string;
  business: string;
  finance: string;
  relationships: string;
  luck: string;
  recommendedProducts: RecommendedProduct[];
  zodiacProduct?: RecommendedProduct;
}

interface RecommendedProduct {
  id: number;
  reason: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

const inputSchema = z.object({
  name: z.string(),
  birthday: z.object({
    day: z.number(),
    month: z.number(),
    year: z.number(),
    calendar: z.enum(["lunar", "solar"]),
  }),
  birthTime: z.object({
    hour: z.number(),
    minute: z.number(),
  }),
  gender: z.enum(["male", "female"]),
  viewMonth: z.number(),
  viewYear: z.number(),
  products: z.array(z.object({
    id: z.number(),
    name: z.string(),
    imageUrl: z.string(),
    description: z.string(),
    price: z.number(),
  })),
});


export const getAstrologyPredictionAction = unauthenticatedAction
  .createServerAction()
  .input(inputSchema)
  .handler(async ({ input }) => {
    const { name, birthday, birthTime, gender, viewMonth, viewYear } = input;

    const prompt = `Bạn là một chuyên gia xem tử vi chuyên nghiệp. Với những thông tin sau:
    Tên: ${name}
    Ngày sinh: ${birthday.day}/${birthday.month}/${birthday.year} (${birthday.calendar})
    Giờ sinh: ${birthTime.hour}:${birthTime.minute}
    Giới tính: ${gender}
    Tháng xem: ${viewMonth}
    
    Hãy phân tích lá số đó và trả về kết quả với các mục: sức khỏe, gia đạo, tình duyên, công danh, sự nghiệp, tài lộc, các mối quan hệ và vận hạn, biến cố trong cuộc đời. Mỗi mục chứa một đoạn văn ngắn gọn.
    
    Dựa trên phân tích tử vi, hãy đề xuất 3 sản phẩm phù hợp từ danh sách sau:
      ${input.products.map(p => `- ID ${p.id}: ${p.name} : ${p.description}`).join('\n')}
    
    Lưu ý quan trọng:
    1. Nếu có vòng tay theo tháng sinh, chỉ gợi ý vòng tay phù hợp với tháng sinh của người dùng (tháng ${birthday.month}).
    2. Không gợi ý vòng tay của các tháng khác.
    3. Các sản phẩm khác có thể được gợi ý dựa trên phân tích tử vi tổng thể.
  
    Hãy định dạng phản hồi của bạn như một đối tượng JSON với các trường sau:
    
    {
      "health": "[Nội dung về sức khỏe]",
      "family": "[Nội dung về gia đạo]",
      "love": "[Nội dung về tình duyên]",
      "career": "[Nội dung về công danh]",
      "business": "[Nội dung về sự nghiệp]",
      "finance": "[Nội dung về tài lộc]",
      "relationships": "[Nội dung về các mối quan hệ]",
      "luck": "[Nội dung về vận hạn và biến cố]",
      "recommendedProducts": [
        {
          "id": [ID sản phẩm],
          "reason": "[Lý do gợi ý sản phẩm, bao gồm cả việc phù hợp với tháng sinh nếu là vòng tay theo tháng]"
        },
        {
          "id": [ID sản phẩm],
          "reason": "[Lý do gợi ý sản phẩm]"
        },
        {
          "id": [ID sản phẩm],
          "reason": "[Lý do gợi ý sản phẩm]"
        }
      ]
    }`;


    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Bạn là một chuyên gia xem tử vi chuyên nghiệp. Hãy trả lời theo định dạng JSON được yêu cầu.",
          },
          {
            role: "user",
            content: prompt,
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      });

      const response = completion.choices[0].message.content;
      const parsedResponse = JSON.parse(response || '{}') as AstrologyPrediction;

      // Enhance the recommended products with full product details
      const enhancedRecommendedProducts = parsedResponse.recommendedProducts.map((rec) => {
        const fullProduct = input.products.find(p => p.id === rec.id);
        return {
          ...rec,
          ...fullProduct // This adds all product details (name, price, imageUrl, etc.)
        };
      });

      return {
        result: {
          ...parsedResponse,
          recommendedProducts: enhancedRecommendedProducts,
        },
      };

    } catch (error) {
      console.error(error);
      throw error;
    }
  });