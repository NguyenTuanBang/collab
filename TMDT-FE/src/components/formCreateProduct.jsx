import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../utils/api.jsx";
import {
  Form,
  Input,
  Button,
  Upload,
  Space,
  Divider,
  Select,
  InputNumber,
  message,
  Card,
  Image,
  Row,
  Col,
  Modal,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const ProductFormModal = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [variants, setVariants] = useState([
    {
      image: null,
      preview: null,
      color: "",
      sizes: [{ size: "", quantity: 0, price: 0 }],
    },
  ]);
  const [tagOption, setTagOption] = useState([]);

  useEffect(() => {
    const getTagOption = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_LOCAL_PORT}/allTags`
        );
        const tags = res.data.data || [];

        // map lại cho phù hợp với Select (hiển thị = name, giá trị = _id)
        const formattedTags = tags.map((tag) => ({
          label: tag.nameTag,
          value: tag._id,
        }));

        setTagOption(formattedTags);
      } catch (err) {
        console.error("Lỗi khi lấy tag:", err);
      }
    };

    getTagOption();
  }, []);

  // Kiểm tra xem 1 biến thể có hợp lệ không
  const isVariantValid = (variant) => {
    if (!variant.color || !variant.image) return false;
    if (variant.sizes.length === 0) return false;
    return variant.sizes.every((s) => s.size && s.quantity > 0 && s.price > 0);
  };

  // Kiểm tra xem tất cả biến thể hiện tại đều hợp lệ
  const allVariantsValid = variants.every(isVariantValid);

  // ====== Quản lý biến thể ======
  const addVariant = () => {
    const isAllValid = variants.every(isVariantValid);

    if (!isAllValid) {
      message.warning(
        "Vui lòng nhập đầy đủ thông tin cho các biến thể trước khi thêm mới!"
      );
      return;
    }

    setVariants([
      ...variants,
      {
        id: Date.now(),
        image: null,
        preview: null,
        color: "",
        sizes: [{ size: "", quantity: 0, price: 0 }],
      },
    ]);
  };

  const removeVariant = (id) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  const addSize = (variantId) => {
    const variant = variants.find((v) => v.id === variantId);

    const allSizesValid = variant.sizes.every(
      (s) => s.size && s.quantity > 0 && s.price > 0
    );

    if (!allSizesValid) {
      message.warning(
        "Vui lòng điền đầy đủ thông tin cho tất cả size trước khi thêm size mới!"
      );
      return;
    }

    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? { ...v, sizes: [...v.sizes, { size: "", quantity: 0, price: 0 }] }
          : v
      )
    );
  };

  const removeSize = (variantId, index) => {
    setVariants(
      variants.map((v) =>
        v.id === variantId
          ? { ...v, sizes: v.sizes.filter((_, i) => i !== index) }
          : v
      )
    );
  };

  const handleUpload = (file, vIndex) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newVariants = [...variants];
      newVariants[vIndex].image = file;
      newVariants[vIndex].preview = e.target.result;
      setVariants(newVariants);
    };
    reader.readAsDataURL(file);
    return false;
  };

  // ====== Gửi form ======
  const onFinish = async (values) => {
    try {
      // Gom dữ liệu chung
      const payload = {
        name: values.name,
        description: values.description,
        tags: values.tags, // array các _id
        variants: variants.map((v) => ({
          color: v.color,
          url: v.image, // hoặc File ảnh
          sizes: v.sizes.map((s) => ({
            size: s.size,
            quantity: s.quantity,
            price: s.price,
          })),
        })),
      };

      // === Tạo FormData ===
      const formData = new FormData();

      // Thêm các trường string
      formData.append("name", payload.name);
      formData.append("description", payload.description);

      // Thêm mảng tags (chuyển sang JSON string)
      formData.append("tags", JSON.stringify(payload.tags));

      // Nối riêng phần ảnh vào, phần còn lại stringify toàn bộ variants
      const imageFiles = []; // giữ danh sách ảnh

      payload.variants.forEach((variant, index) => {
        if (variant.url instanceof File) {
          imageFiles.push({ index, file: variant.url });
        }
      });

      // Thêm toàn bộ variants (không có ảnh) vào form dưới dạng JSON
      const variantsWithoutFile = payload.variants.map((v, i) => ({
        color: v.color,
        sizes: v.sizes,
        // để tạm null url, backend sẽ xử lý upload
        urlIndex: i,
      }));
      formData.append("variants", JSON.stringify(variantsWithoutFile));

      // Thêm các file riêng
      imageFiles.forEach(({ index, file }) => {
        formData.append("variantImages", file);
      });

      // === Gửi request ===
      await api.post(`/createProduct`, formData);

      message.success("Lưu sản phẩm thành công!");
      setOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("Lưu thất bại!");
    }
  };

  return (
    <>
      {/* Nút mở modal */}
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
      >
        Thêm sản phẩm
      </Button>

      {/* Modal chứa form */}
      <Modal
        title="Thêm sản phẩm mới"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1000} // rộng để hiển thị 2 card cạnh nhau
        centered
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          {/* Thông tin cơ bản */}
          <Card title="Thông tin cơ bản" className="mb-4">
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Nhập mô tả sản phẩm" }]}
            >
              <Input.TextArea rows={3} placeholder="Nhập mô tả sản phẩm" />
            </Form.Item>

            <Form.Item
              name="tags"
              label="Tags"
              rules={[
                {
                  validator: (_, value) => {
                    if (value && value.length > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Vui lòng nhập ít nhất 1 tag")
                    );
                  },
                },
              ]}
            >
              <Select
                mode="tags"
                tokenSeparators={[","]}
                placeholder="Nhập hoặc chọn tags"
                options={tagOption}
                onChange={(values) => {
                  // 🔹 Chuẩn hóa tag: trim + lowercase
                  const normalized = values
                    .map((v) => v.trim().toLowerCase())
                    .filter((v) => v.length > 0); // loại bỏ chuỗi rỗng

                  // 🔹 Loại bỏ trùng lặp
                  const unique = [...new Set(normalized)];

                  // Cập nhật lại form value
                  form.setFieldValue("tags", unique);
                }}
              />
            </Form.Item>
          </Card>

          <Divider orientation="left">Biến thể sản phẩm</Divider>

          {/* Grid hiển thị 2 card mỗi hàng */}
          <div
            style={{
              maxHeight: "600px", // bạn có thể chỉnh 300–500px tùy giao diện
              overflowY: "auto",
              paddingRight: "8px", // tránh che nội dung khi có scrollbar
            }}
          >
            <Row gutter={[16, 16]}>
              {variants.map((variant, vIndex) => (
                <Col xs={24} md={12} key={variant.id}>
                  <Card
                    title={`Biến thể ${vIndex + 1}`}
                    extra={
                      variants.length > 1 && (
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => removeVariant(variant.id)}
                        />
                      )
                    }
                    bordered
                    style={{
                      maxHeight: "400px", // bạn có thể chỉnh 300–500px tùy giao diện
                      overflowY: "auto",
                      paddingRight: "8px",
                      height: "100%", // tránh che nội dung khi có scrollbar
                    }}
                    hoverable
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      {/* Upload ảnh */}
                      <Upload
                        beforeUpload={(file) => handleUpload(file, vIndex)}
                        showUploadList={false}
                        accept="image/*"
                      >
                        <Button icon={<UploadOutlined />}>
                          Chọn ảnh sản phẩm
                        </Button>
                      </Upload>

                      {/* Hiển thị ảnh xem trước */}
                      {variant.preview && (
                        <Image
                          src={variant.preview}
                          alt="preview"
                          width={120}
                          height={120}
                          style={{
                            borderRadius: 8,
                            objectFit: "cover",
                            border: "1px solid #f0f0f0",
                          }}
                        />
                      )}

                      {/* Màu sắc */}
                      <Input
                        placeholder="Nhập màu sắc"
                        value={variant.color}
                        onChange={(e) => {
                          const newVariants = [...variants];
                          newVariants[vIndex].color = e.target.value;
                          setVariants(newVariants);
                        }}
                      />

                      {/* Danh sách size */}
                      <Divider orientation="left" style={{ marginTop: 12 }}>
                        Size
                      </Divider>

                      {variant.sizes.map((s, sIndex) => (
                        <div
                          key={sIndex}
                          style={{
                            border: "1px solid #f0f0f0",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 8,
                            background: "#fafafa",
                          }}
                        >
                          <Row gutter={12} align="middle">
                            <Col span={6}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Size
                              </label>
                              <Input
                                placeholder="VD: S, M, L"
                                value={s.size}
                                onChange={(e) => {
                                  const newVariants = [...variants];
                                  newVariants[vIndex].sizes[sIndex].size =
                                    e.target.value;
                                  setVariants(newVariants);
                                }}
                              />
                            </Col>

                            <Col span={8}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Số lượng
                              </label>
                              <InputNumber
                                min={0}
                                value={s.quantity}
                                placeholder="Nhập số lượng"
                                onChange={(val) => {
                                  const newVariants = [...variants];
                                  newVariants[vIndex].sizes[sIndex].quantity =
                                    val;
                                  setVariants(newVariants);
                                }}
                                style={{ width: "100%" }}
                              />
                            </Col>

                            <Col span={8}>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Giá (VNĐ)
                              </label>
                              <InputNumber
                                min={0}
                                value={s.price}
                                placeholder="Nhập giá sản phẩm"
                                formatter={(value) =>
                                  `${value}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    "."
                                  )
                                }
                                parser={(value) => value.replace(/\./g, "")}
                                style={{ width: "100%" }}
                                onChange={(val) => {
                                  const newVariants = [...variants];
                                  newVariants[vIndex].sizes[sIndex].price = val;
                                  setVariants(newVariants);
                                }}
                              />
                            </Col>

                            <Col span={2} style={{ textAlign: "center" }}>
                              {variant.sizes.length > 1 && (
                                <Button
                                  type="text"
                                  danger
                                  icon={<DeleteOutlined />}
                                  onClick={() => removeSize(variant.id, sIndex)}
                                />
                              )}
                            </Col>
                          </Row>
                        </div>
                      ))}

                      <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={() => addSize(variant.id)}
                      >
                        Thêm size
                      </Button>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Nút thêm biến thể */}
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addVariant}
            block
            className="mt-4 mb-4"
            disabled={!variants.every(isVariantValid)}
          >
            Thêm biến thể
          </Button>

          {/* Nút hành động */}
          <Space style={{ display: "flex", justifyContent: "end" }}>
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Lưu sản phẩm
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
};

export default ProductFormModal;
