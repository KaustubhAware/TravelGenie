import { motion, AnimatePresence } from "framer-motion";

export default function Modal({
  open,
  onClose,
  title,
  children,
}) {

  return (

    <AnimatePresence>

      {open && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
        >

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
            }}
            className="w-full max-w-2xl rounded-3xl bg-white p-8 shadow-2xl"
          >

            <div className="flex items-center justify-between mb-6">

              <h3 className="text-2xl font-black text-slate-900">

                {title}

              </h3>

              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 text-xl"
              >

                ×

              </button>

            </div>

            {children}

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );

}