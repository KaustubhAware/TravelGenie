import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const exportTripPDF = async (
  elementId,
  destination = "trip"
) => {

  try {

    // ============================================
    // TARGET
    // ============================================

    const original =
      document.getElementById(
        elementId
      );

    if (!original) {
      return;
    }

    // ============================================
    // CLONE NODE
    // ============================================

    const cloned =
      original.cloneNode(true);

    // ============================================
    // REMOVE MAPS
    // ============================================

    cloned
      .querySelectorAll(
        ".leaflet-container"
      )
      .forEach((el) => el.remove());

    // ============================================
    // REMOVE ALL GRADIENTS + OKLCH
    // ============================================

    const all =
      cloned.querySelectorAll("*");

    all.forEach((el) => {

      // REMOVE GRADIENTS
      el.style.backgroundImage =
        "none";

      // FORCE SAFE COLORS
      el.style.backgroundColor =
        "#ffffff";

      el.style.color =
        "#111827";

      el.style.borderColor =
        "#d1d5db";

      el.style.boxShadow =
        "none";

      // REMOVE FILTERS
      el.style.filter =
        "none";

      el.style.backdropFilter =
        "none";
    });

    // ============================================
    // TEMP CONTAINER
    // ============================================

    const wrapper =
      document.createElement(
        "div"
      );

    wrapper.style.position =
      "fixed";

    wrapper.style.left =
      "-99999px";

    wrapper.style.top =
      "0";

    wrapper.style.width =
      "1400px";

    wrapper.style.background =
      "#ffffff";

    wrapper.appendChild(
      cloned
    );

    document.body.appendChild(
      wrapper
    );

    // ============================================
    // HTML2CANVAS
    // ============================================

    const canvas =
      await html2canvas(
        cloned,
        {
          scale: 2,
          useCORS: true,
          backgroundColor:
            "#ffffff",
          logging: false,
        }
      );

    // ============================================
    // CLEANUP
    // ============================================

    document.body.removeChild(
      wrapper
    );

    // ============================================
    // IMAGE
    // ============================================

    const imgData =
      canvas.toDataURL(
        "image/png"
      );

    // ============================================
    // PDF
    // ============================================

    const pdf =
      new jsPDF(
        "p",
        "mm",
        "a4"
      );

    const pdfWidth =
      pdf.internal.pageSize.getWidth();

    const pdfHeight =
      (canvas.height * pdfWidth)
      / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      pdfWidth,
      pdfHeight
    );

    // ============================================
    // SAVE
    // ============================================

    pdf.save(
      `${destination}-trip.pdf`
    );

    console.log(
      "PDF DOWNLOADED"
    );

  } catch (error) {

    console.error(
      "PDF EXPORT ERROR:",
      error
    );
  }
};

export const exportInvoicePDF = (booking) => {

  const pdf = new jsPDF("p", "mm", "a4");

  const total =
    booking.total_cost ||
    booking.budget ||
    booking.cost ||
    0;

  pdf.setFillColor(37, 99, 235);
  pdf.rect(0, 0, 210, 34, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.text("TravelGenie", 16, 18);
  pdf.setFontSize(10);
  pdf.text("AI-Powered Tour & Travel Agency Platform", 16, 26);

  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(18);
  pdf.text("Travel Invoice", 16, 50);

  pdf.setFontSize(10);
  pdf.text(`Invoice No: INV-${booking.booking_id || "TG"}`, 140, 46);
  pdf.text(`Booking ID: ${booking.booking_id || "-"}`, 140, 53);
  pdf.text(`Payment Status: ${booking.payment_status || booking.status || "-"}`, 140, 60);

  pdf.setDrawColor(229, 231, 235);
  pdf.line(16, 68, 194, 68);

  pdf.setFontSize(12);
  pdf.text("Customer Information", 16, 80);
  pdf.setFontSize(10);
  pdf.text(`Name: ${booking.name || "-"}`, 16, 90);
  pdf.text(`Email: ${booking.email || "-"}`, 16, 97);
  pdf.text(`Phone: ${booking.phone || "-"}`, 16, 104);

  pdf.setFontSize(12);
  pdf.text("Trip Details", 16, 122);
  pdf.setFontSize(10);
  pdf.text(`Destination: ${booking.destination || "-"}`, 16, 132);
  pdf.text(`Duration: ${booking.days || "-"} Days`, 16, 139);
  pdf.text(`Assigned Agent: ${booking.assigned_agent || "TravelGenie Operations"}`, 16, 146);

  pdf.setFillColor(248, 250, 252);
  pdf.rect(16, 164, 178, 34, "F");
  pdf.setTextColor(75, 85, 99);
  pdf.text("Package Amount", 24, 178);
  pdf.text(`Rs. ${total}`, 160, 178, { align: "right" });
  pdf.text("Taxes & Fees", 24, 188);
  pdf.text("Rs. 0", 160, 188, { align: "right" });

  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(14);
  pdf.text("Total Paid", 24, 214);
  pdf.text(`Rs. ${total}`, 160, 214, { align: "right" });

  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  pdf.text(
    "This is a simulated project invoice generated by TravelGenie for agency workflow demonstration.",
    16,
    270
  );

  pdf.save(`invoice-${booking.booking_id || "travelgenie"}.pdf`);
};
