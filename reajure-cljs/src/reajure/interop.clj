(ns reajure.interop
  (:require [clojure.string :as str]))

;; Available component `tags` must be statically declared since component object is not available in clj
(def tags '[vw
            txt
            ipt
            lbl
            btn])

(defn ->js-style 
  "Convert cljs style keyword shorthands to their string equivalents.
   e.g. :flx-1 -> 'flx1' || :jc-sb -> 'jcSB'."
  [props sk]
  (if (vector? (get props sk))
    (assoc props sk
           (into []
                 (for [v (get props sk)]
                   (if (keyword? v) (let [k (name v)
                                          [k1 k2] (str/split k #"-")]
                                      (if-not k2 k1 (str/join "" [k1 (str/upper-case k2)])))
                       v))))
    props))

(comment
  ;; object style 
  (->js-style {:style {:flex 1}} :style)
  ;; vector style, with keyword shorthand
  (->js-style {:style [:flx-1]} :style))

(defn ->js-props 
  "Converts cljs `props` to js props."
  [props]
  (-> props
      (->js-style :style)
      (->js-style :textStyle)))

