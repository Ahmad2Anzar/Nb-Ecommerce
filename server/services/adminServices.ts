import prisma  from "../db"; // Adjust path based on your project structure

export const getManagersService = async () => {
  const managers = await prisma.manager.findMany({
    // include: {
    //   user: true, // if you want to include associated user details
    // },
  });
  return managers;
};


export const addPaymentService = async (
    managerId: any,
    ratePerDay: number,
    validityInDays: number
  ) => {
    const manager = await prisma.manager.findUnique({
      where: { managerId },
    });
  
    if (!manager) {
      throw new Error("Manager not found");
    }
  
    const today = new Date();
    const currentValidity = manager.validity ? new Date(manager.validity) : null;
  
    console.log("Today:", today);
    console.log("Current Validity:", currentValidity);
    console.log("Validity In Days:", validityInDays);
  
    let newValidity: Date;
  
    if (currentValidity && currentValidity >= today) {
      newValidity = new Date(currentValidity);
      newValidity.setDate(currentValidity.getDate() + validityInDays);
    } else {
      newValidity = new Date(today);
      newValidity.setDate(today.getDate() + validityInDays);
    }
  
    console.log("New Validity:", newValidity);
  
    if (isNaN(newValidity.getTime())) {
      throw new Error("Generated an invalid date for validity");
    }
  
    const updatedManager = await prisma.manager.update({
      where: { managerId },
      data: {
        ratePerDay,
        validity: newValidity,
      },
    });
  
    return updatedManager;
  };
  
  
  