export const generateDoughnutData = (fields: any[]) => {
    const stateCounts: { [key: string]: number } = {};
  
    // Đếm số lượng sân theo trạng thái
    fields.forEach((field) => {
      const stateName = field.state.name;
      stateCounts[stateName] = (stateCounts[stateName] || 0) + 1;
    });
  
    // Tạo dữ liệu cho biểu đồ
    const labels = Object.keys(stateCounts); // Các trạng thái
    const data = Object.values(stateCounts); // Số lượng sân theo trạng thái
    const backgroundColors = labels.map((label) => {
      switch (label) {
        case "Active":
          return "#4CAF50"; // Màu xanh lá
        case "Maintenance":
          return "#FFC107"; // Màu vàng
        case "Deactivated":
          return "#F44336"; // Màu đỏ
        case "Suspended":
          return "#9E9E9E"; // Màu xám
        default:
          return "#607D8B"; // Màu xanh xám
      }
    });
  
    const doughnutData = {
      labels,
      datasets: [
        {
          label: "Số sân",
          data,
          backgroundColor: backgroundColors,
          hoverBackgroundColor: backgroundColors.map((color) => color + "CC"), // Màu khi hover
        },
      ],
    };
  
    const doughnutOptions = {
      plugins: {
        tooltip: {
          callbacks: {
            label: function (tooltipItem: any) {
              const value = data[tooltipItem.dataIndex]; // Lấy số lượng sân
              return `Số sân: ${value} sân`; // Hiển thị nội dung tùy chỉnh
            },
          },
        },
      },
    };
  
    return { doughnutData, doughnutOptions };
  };