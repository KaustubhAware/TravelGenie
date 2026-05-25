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

export const exportTrekGuidePDF = (pkg, batch = null) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const title = pkg?.title || "Maharashtra Trek";

  pdf.setFillColor(234, 88, 12);
  pdf.rect(0, 0, 210, 34, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(22);
  pdf.text("TravelGenie", 16, 18);
  pdf.setFontSize(10);
  pdf.text("Premium Maharashtra Trek Guide", 16, 26);

  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(18);
  pdf.text(title, 16, 50);
  pdf.setFontSize(10);
  pdf.text(`Location: ${pkg?.location || "Maharashtra"}`, 16, 60);
  pdf.text(`Duration: ${pkg?.duration || "-"}`, 16, 67);
  pdf.text(`Difficulty: ${pkg?.difficulty || "Moderate"}`, 16, 74);
  pdf.text(`Altitude: ${pkg?.altitude || "Sahyadri range"}`, 16, 81);
  pdf.text(`Distance: ${pkg?.trek_distance || "-"}`, 16, 88);

  pdf.setDrawColor(229, 231, 235);
  pdf.line(16, 96, 194, 96);

  pdf.setFontSize(13);
  pdf.text("Schedule", 16, 110);
  pdf.setFontSize(10);
  pdf.text(`Next Batch: ${batch?.start_date || "Announcing soon"}`, 16, 120);
  pdf.text(`Booking Deadline: ${batch?.booking_deadline || "Before departure"}`, 16, 127);
  pdf.text(`Pickup: ${batch?.pickup_location || (pkg?.pickup_points || [])[0] || "Pune"}`, 16, 134);
  pdf.text(`Guide: ${batch?.guide_name || "Assigned before departure"}`, 16, 141);

  pdf.setFontSize(13);
  pdf.text("Weather & Safety Notes", 16, 158);
  pdf.setFontSize(10);
  const notes = [
    `Best season: ${pkg?.best_season || "Post-monsoon and winter"}`,
    "Check rainfall and road conditions before monsoon departures.",
    "Carry personal medication, rainwear, torch, ID proof, and sturdy shoes.",
    "Emergency contacts are shared by the trek leader before departure.",
  ];
  notes.forEach((note, index) => pdf.text(`- ${note}`, 18, 168 + index * 7));

  pdf.setFontSize(13);
  pdf.text("Emergency", 16, 208);
  pdf.setFontSize(10);
  pdf.text("TravelGenie Operations: +91 90000 00000", 16, 218);
  pdf.text("Local emergency: 112", 16, 225);

  pdf.setDrawColor(17, 24, 39);
  pdf.rect(160, 210, 24, 24);
  pdf.setFontSize(7);
  pdf.text("QR", 169, 224);

  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  pdf.text("Generated by TravelGenie for Maharashtra trek operations.", 16, 276);
  pdf.save(`${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-guide.pdf`);
};
